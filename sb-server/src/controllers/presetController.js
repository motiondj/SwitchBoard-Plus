const { Preset, PresetCommand, Client } = require('../models');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
const { emitExecutionCommand, emitClientStatus, emitExecutionStop } = require('../services/socketService');

// 모든 프리셋 조회
const getAllPresets = async (req, res) => {
  try {
    const presets = await Preset.findAll({
      include: [{
        model: PresetCommand,
        as: 'PresetCommands',
        include: [{
          model: Client,
          as: 'Client',
          attributes: ['id', 'name', 'ip']
        }]
      }]
    });
    res.json(presets);
  } catch (error) {
    logger.error('Error fetching presets:', error);
    res.status(500).json({ error: 'Failed to fetch presets' });
  }
};

// ID로 프리셋 조회
const getPresetById = async (req, res) => {
  try {
    const preset = await Preset.findByPk(req.params.id, {
      include: [{
        model: PresetCommand,
        as: 'PresetCommands',
        include: [{
          model: Client,
          as: 'Client',
          attributes: ['id', 'name', 'ip']
        }]
      }]
    });

    if (!preset) {
      return res.status(404).json({ error: 'Preset not found' });
    }

    res.json(preset);
  } catch (error) {
    logger.error('Error fetching preset:', error);
    res.status(500).json({ error: 'Failed to fetch preset' });
  }
};

// 새 프리셋 생성
const createPreset = async (req, res, next) => {
  try {
    logger.info('[createPreset] 입력값:', req.body);
    const { name, description, commands, selectedGroups } = req.body;

    // 프리셋 생성
    const preset = await Preset.create({
      name,
      description,
      selectedGroups
    });

    // 명령어가 있는 경우에만 처리
    if (commands && Array.isArray(commands)) {
      // 클라이언트 ID 유효성 검사
      const clientIds = commands.map(cmd => cmd.clientId);
      const clients = await Client.findAll({
        where: { id: clientIds }
      });

      if (clients.length !== clientIds.length) {
        throw new AppError('일부 클라이언트를 찾을 수 없습니다.', 400);
      }

      // 명령어 생성
      await Promise.all(commands.map((cmd, index) => 
        PresetCommand.create({
          presetId: preset.id,
          clientId: cmd.clientId,
          command: cmd.command,
          order: index + 1,
          status: 'pending'
        })
      ));
    }

    // 생성된 프리셋 조회
    const createdPreset = await Preset.findByPk(preset.id, {
      include: [{
        model: PresetCommand,
        as: 'PresetCommands',
        include: [{
          model: Client,
          as: 'Client',
          attributes: ['id', 'name', 'ip']
        }]
      }]
    });

    res.status(201).json(createdPreset);
  } catch (error) {
    logger.error('[createPreset] 에러:', error);
    next(error);
  }
};

// 프리셋 업데이트
const updatePreset = async (req, res) => {
  try {
    const { name, description, commands, selectedGroups } = req.body;
    const preset = await Preset.findByPk(req.params.id);

    if (!preset) {
      return res.status(404).json({ error: 'Preset not found' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    await preset.update({
      name,
      description,
      selectedGroups
    });

    if (commands) {
      // 기존 명령어 삭제
      await PresetCommand.destroy({
        where: { presetId: preset.id }
      });

      // 새 명령어 추가
      await Promise.all(commands.map(async (cmd, index) => {
        await PresetCommand.create({
          presetId: preset.id,
          clientId: cmd.clientId,
          command: cmd.command,
          order: index
        });
      }));
    }

    const updatedPreset = await Preset.findByPk(preset.id, {
      include: [{
        model: PresetCommand,
        as: 'PresetCommands',
        include: [{
          model: Client,
          as: 'Client'
        }]
      }]
    });

    res.json(updatedPreset);
  } catch (error) {
    logger.error('Error updating preset:', error);
    res.status(500).json({ error: 'Failed to update preset' });
  }
};

// 프리셋 삭제
const deletePreset = async (req, res) => {
  try {
    const preset = await Preset.findByPk(req.params.id);

    if (!preset) {
      return res.status(404).json({ error: 'Preset not found' });
    }

    // 관련된 PresetCommand 삭제
    await PresetCommand.destroy({
      where: { presetId: preset.id }
    });

    await preset.destroy();
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting preset:', error);
    res.status(500).json({ error: 'Failed to delete preset' });
  }
};

// 프리셋 실행
const executePreset = async (req, res) => {
  try {
    const preset = await Preset.findByPk(req.params.id, {
      include: [{
        model: PresetCommand,
        as: 'PresetCommands',
        include: [{ model: Client, as: 'Client' }]
      }]
    });

    if (!preset) {
      return res.status(404).json({ error: 'Preset not found' });
    }

    // 프리셋 상태 업데이트
    await preset.update({
      status: 'running',
      active: true,
      lastRun: new Date()
    });

    // 실제 명령 실행: 각 클라이언트에 명령 전송
    const executionResults = [];
    for (const cmd of preset.PresetCommands) {
      if (cmd.Client) {
        const client = cmd.Client;
        
        // 클라이언트 상태 재확인
        const currentClient = await Client.findOne({ where: { id: client.id } });
        if (!currentClient) {
          logger.warn(`[PRESET] 클라이언트를 찾을 수 없습니다: ${client.name} (${client.uuid})`);
          executionResults.push({
            clientId: client.id,
            clientName: client.name,
            success: false,
            error: '클라이언트를 찾을 수 없습니다'
          });
          continue;
        }

        if (currentClient.status !== 'online') {
          logger.warn(`[PRESET] 클라이언트가 오프라인 상태입니다: ${currentClient.name} (${currentClient.uuid})`);
          executionResults.push({
            clientId: currentClient.id,
            clientName: currentClient.name,
            success: false,
            error: '클라이언트가 오프라인 상태입니다'
          });
          continue;
        }

        // 클라이언트 상태를 즉시 running으로 변경
        await currentClient.update({ 
          status: 'running',
          lastStatusChange: new Date()  // 상태 변경 시간 기록
        });
        logger.info(`[PRESET] 클라이언트 상태를 running으로 즉시 변경: ${currentClient.name} (${currentClient.uuid})`);
        // 상태 변경 이벤트 발송
        emitClientStatus({
          uuid: currentClient.uuid,
          status: 'running',
          metrics: currentClient.metrics
        });

        // nDisplay 명령인 경우 최소화 후 실행
        if (cmd.command.includes('nDisplay')) {
          const minimizeCommand = `
            $processes = Get-Process | Where-Object { $_.MainWindowTitle -ne "" }
            foreach ($process in $processes) {
              $handle = $process.MainWindowHandle
              if ($handle -ne [IntPtr]::Zero) {
                [void][Win32.Window]::ShowWindow($handle, 6)
              }
            }
          `;
          
          // 먼저 최소화 명령 실행
          emitExecutionCommand(currentClient, `powershell -Command "${minimizeCommand}"`);
          
          // 2초 대기 후 nDisplay 실행
          setTimeout(() => {
            emitExecutionCommand(currentClient, cmd.command);
          }, 2000);
        } else {
          logger.info(`[PRESET] 명령 실행 시도: ${currentClient.name} (${currentClient.uuid}) - ${cmd.command}`);
          emitExecutionCommand(currentClient, cmd.command);
        }
        
        executionResults.push({
          clientId: currentClient.id,
          clientName: currentClient.name,
          success: true
        });
      }
    }

    res.json({ 
      message: 'Preset execution started', 
      id: preset.id,
      results: executionResults
    });
  } catch (error) {
    logger.error('Error executing preset:', error);
    res.status(500).json({ error: 'Failed to execute preset' });
  }
};

// 프리셋 정지
const stopPreset = async (req, res) => {
  try {
    const preset = await Preset.findByPk(req.params.id, {
      include: [{
        model: PresetCommand,
        as: 'PresetCommands',
        include: [{ model: Client, as: 'Client' }]
      }]
    });

    if (!preset) {
      return res.status(404).json({ error: 'Preset not found' });
    }

    // 프리셋 상태 업데이트
    await preset.update({
      status: 'idle',
      active: false
    });

    // 각 클라이언트의 상태를 online으로 변경
    for (const cmd of preset.PresetCommands) {
      if (cmd.Client) {
        const client = cmd.Client;
        const currentClient = await Client.findOne({ where: { id: client.id } });
        
        if (currentClient) {
          // 1. 클라이언트에게 실행 중지 명령 전송
          emitExecutionStop(currentClient);

          // 2. 상태를 online으로 변경
          await currentClient.update({ 
            status: 'online',
            lastStatusChange: new Date()  // 상태 변경 시간 기록
          });
          
          emitClientStatus({
            uuid: currentClient.uuid,
            status: 'online',
            metrics: currentClient.metrics
          });
        }
      }
    }

    res.json({ 
      message: 'Preset stopped', 
      id: preset.id 
    });
  } catch (error) {
    logger.error('Error stopping preset:', error);
    res.status(500).json({ error: 'Failed to stop preset' });
  }
};

module.exports = {
  getAllPresets,
  getPresetById,
  createPreset,
  updatePreset,
  deletePreset,
  executePreset,
  stopPreset
}; 
import os
from PIL import Image, ImageDraw

def create_icon(size, color, output_path):
    """주어진 크기와 색상으로 아이콘을 생성합니다."""
    # 정사각형 이미지 생성
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 원 그리기
    margin = size // 8
    draw.ellipse([margin, margin, size - margin, size - margin], fill=color)
    
    # 저장
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, 'PNG')

def generate_icons():
    """모든 필요한 아이콘을 생성합니다."""
    sizes = [16, 32, 48, 64, 128, 256]
    colors = {
        'normal': (0, 255, 0, 255),    # 초록색
        'warning': (255, 165, 0, 255),  # 주황색
        'error': (255, 0, 0, 255),     # 빨간색
        'offline': (128, 128, 128, 255) # 회색
    }
    
    base_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'assets', 'icons')
    
    for size in sizes:
        for status, color in colors.items():
            output_path = os.path.join(base_path, f'{status}_{size}.png')
            create_icon(size, color, output_path)
            print(f'Created icon: {output_path}')

if __name__ == '__main__':
    generate_icons() 
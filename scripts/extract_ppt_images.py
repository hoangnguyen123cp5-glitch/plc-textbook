import os

slide_dir = os.path.join(os.path.dirname(__file__), '..', 'Slide')
public_img_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'images', 'slides')

ppt_mapping = [
    ('03-binary-operations', 'Slide 3 -'),
    ('04-numeric-operations', 'Slide 4 -'),
    ('05-analog-signals', 'Slide 5 -'),
    ('06-other-plc-brands', 'Slide 6 -'),
]

all_files = os.listdir(slide_dir)

def extract_images_from_binary(data, out_dir, prefix):
    count = 0
    
    # 1. Carve JPEGs: \xff\xd8\xff ... \xff\xd9
    pos = 0
    while True:
        start = data.find(b'\xff\xd8\xff', pos)
        if start == -1:
            break
        end = data.find(b'\xff\xd9', start + 4)
        if end == -1:
            pos = start + 3
            continue
        
        img_len = (end + 2) - start
        # Filter out tiny icon noise < 5KB and invalid massive streams > 10MB
        if 5120 < img_len < 10485760:
            count += 1
            filename = f"{prefix}_carved_{count:03d}.jpg"
            with open(os.path.join(out_dir, filename), 'wb') as f:
                f.write(data[start:end+2])
        pos = end + 2

    # 2. Carve PNGs: \x89PNG\r\n\x1a\n ... IEND\xaeB`\x82
    pos = 0
    while True:
        start = data.find(b'\x89PNG\r\n\x1a\n', pos)
        if start == -1:
            break
        end = data.find(b'IEND', start + 8)
        if end == -1:
            pos = start + 8
            continue
        
        img_len = (end + 8) - start
        if 5120 < img_len < 10485760:
            count += 1
            filename = f"{prefix}_carved_{count:03d}.png"
            with open(os.path.join(out_dir, filename), 'wb') as f:
                f.write(data[start:end+8])
        pos = end + 8

    return count

for slug, pattern in ppt_mapping:
    matched = [f for f in all_files if f.endswith('.ppt') and pattern in f]
    out_dir = os.path.join(public_img_dir, slug)
    os.makedirs(out_dir, exist_ok=True)
    
    for filename in matched:
        print(f"Processing {filename} -> {slug} ...")
        full_path = os.path.join(slide_dir, filename)
        with open(full_path, 'rb') as f:
            data = f.read()
        num = extract_images_from_binary(data, out_dir, slug[:6])
        print(f"  Extracted {num} images into {slug}")

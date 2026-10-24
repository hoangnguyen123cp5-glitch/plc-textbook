import os
import zipfile
import shutil

slide_dir = os.path.join(os.path.dirname(__file__), '..', 'Slide')
public_img_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'images', 'slides')
os.makedirs(public_img_dir, exist_ok=True)

lesson_mapping = [
    ('01-programmable-control', lambda f: 'Slide 1 -' in f or 'Slide 1 ' in f),
    ('02-s7-1200-tia-portal', lambda f: 'Slide 2 -' in f),
    ('03-binary-operations', lambda f: 'Slide 3 -' in f and 'phép toán' in f.lower()),
    ('04-numeric-operations', lambda f: 'Slide 4 -' in f and 'phép toán' in f.lower()),
    ('05-analog-signals', lambda f: 'Slide 5 -' in f and 'analog' in f.lower()),
    ('06-other-plc-brands', lambda f: 'Slide 6 -' in f and 'hãng' in f.lower()),
    ('07-system-design', lambda f: 'Slide 7 -' in f and 'thiết kế' in f.lower()),
    ('08-advanced-instructions', lambda f: 'Slide 3-1' in f or 'Slide 3-2' in f),
    ('09-high-speed-counting', lambda f: 'Slide 4-1' in f or 'Slide 4-2' in f),
    ('10-closed-loop-pid', lambda f: 'Slide 5-2' in f),
    ('11-communication', lambda f: 'Slide 6-1' in f or 'Slide 6-2' in f),
    ('12-fault-diagnostics', lambda f: 'Slide 7 -' in f and 'chẩn đoán' in f.lower()),
    ('13-s7-300', lambda f: 'Slide 8 -' in f),
    ('14-system-upgrade', lambda f: 'Slide 9-1' in f or 'Slide 9-2' in f),
    ('15-system-integration', lambda f: 'Slide 9-3' in f),
]

all_files = os.listdir(slide_dir)
print(f"Scanning {len(all_files)} files in Slide/ ...")

total_images = 0

for slug, matcher in lesson_mapping:
    matched = [f for f in all_files if f.endswith('.pptx') and matcher(f)]
    lesson_out = os.path.join(public_img_dir, slug)
    os.makedirs(lesson_out, exist_ok=True)
    
    extracted_count = 0
    
    for filename in matched:
        full_path = os.path.join(slide_dir, filename)
        try:
            with zipfile.ZipFile(full_path, 'r') as z:
                # filter media files
                media_names = [n for n in z.namelist() if n.startswith('ppt/media/') and n.lower().endswith(('.png', '.jpg', '.jpeg'))]
                prefix = "".join(c if c.isalnum() else "_" for c in filename[:12])
                
                for idx, m_name in enumerate(media_names):
                    info = z.getinfo(m_name)
                    # Filter out tiny bullets / decorative icons < 6 KB
                    if info.file_size > 6144:
                        ext = os.path.splitext(m_name)[1]
                        out_name = f"{prefix}_{idx+1:03d}{ext}"
                        out_path = os.path.join(lesson_out, out_name)
                        
                        with z.open(m_name) as src, open(out_path, 'wb') as dst:
                            shutil.copyfileobj(src, dst)
                        
                        extracted_count += 1
                        total_images += 1
        except Exception as e:
            print(f"Error reading {filename}: {e}")
            
    print(f"[{slug}]: Extracted {extracted_count} authentic diagrams from {len(matched)} slides.")

print("=" * 60)
print(f"TOTAL EXTRACTED: {total_images} real industrial diagrams & photos!")

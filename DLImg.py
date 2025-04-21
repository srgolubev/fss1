import vk_api
import os
import requests
import json
import re

# Вставьте ваш VK API токен сюда!
vk_session = vk_api.VkApi(token='vk1.a.PGkBw--_ABUxNcG6JILb7XueaIlRKfwbPG7015c3fXzdoP0FI8ATSdgAkQpGkGnYBQ-bPQXuSgI-6RPp-kc-Zm2rSwH7cmM3dBQLTh0b2jGFf0TEncdza0pQXFTd6eMexGUqf4M5BjQwfelGy6fx4JR7NBNFXrRM3fOlNtBROFqrBZGvYzTabLauhRAcrU7zН')
vk = vk_session.get_api()

output_dir = "assets/images"
os.makedirs(output_dir, exist_ok=True)

log_dict = {}

# Загрузим все photo-ид из файла (по одной на строку)
with open("imglinks.txt", encoding="utf-8") as f:
    photo_ids = [line.strip() for line in f if line.strip() and ("photo" in line or "_" in line)]

for pid in photo_ids:
    orig_pid = pid  # для лога
    # Привести к формату ownerid_photoid
    if pid.startswith("photo"):
        pid = pid.replace("photo", "")
    if "vk.com" in pid:
        # Если это ссылка, вытащить id из нее
        m = re.search(r'photo(-?\d+_\d+)', pid)
        if m:
            pid = m.group(1)
        else:
            print(f"Пропущено (не похоже на photo-id): {pid}")
            continue
    try:
        response = vk.photos.getById(photos=pid)
        for item in response:
            url = item['sizes'][-1]['url']  # Самое большое изображение
            filename = os.path.join(output_dir, url.split('/')[-1].split('?')[0])
            img_data = requests.get(url, timeout=10).content
            with open(filename, "wb") as f:
                f.write(img_data)
            print(f"Скачано: {filename}")
            # Лог соответствий
            log_dict[orig_pid] = filename.replace("\\", "/")
            log_dict[url] = filename.replace("\\", "/")
    except Exception as e:
        print(f"Ошибка с {pid}: {e}")

# Сохраняем лог в JSON
with open("download_log.json", "w", encoding="utf-8") as f:
    json.dump(log_dict, f, ensure_ascii=False, indent=2)

print("Готово! Лог соответствий сохранён в download_log.json")
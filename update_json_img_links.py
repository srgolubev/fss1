import json

# Load the download log
with open('download_log.json', 'r', encoding='utf-8') as f:
    url_to_local = json.load(f)

# Load the activities.json
data_path = 'data/activities.json'
with open(data_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Helper to replace links in a list of images
def replace_links(img_list):
    new_list = []
    for img in img_list:
        # If the image URL is in the download log, replace it
        new_list.append(url_to_local.get(img, img))
    return new_list

# Update all activities
for activity in data.get('activities', []):
    if 'images' in activity:
        activity['images'] = replace_links(activity['images'])

# Save the updated JSON
with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Image links in activities.json have been updated to local paths.')

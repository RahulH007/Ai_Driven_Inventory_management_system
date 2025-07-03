import cv2
from pyzbar.pyzbar import decode
import requests
import json

HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip,deflate'
}

def fetch_product_details(upc):
    url = f'https://api.upcitemdb.com/prod/trial/lookup?upc={upc}'
    try:
        resp = requests.get(url, headers=HEADERS)
        if resp.status_code != 200:
            print(f"Error: Received status code {resp.status_code}")
            return

        data = json.loads(resp.text)
        if 'items' not in data or not data['items']:
            print("No product found.")
            return

        for item in data['items']:
            print(f"\n--- Product Info ---")
            print(f"Product ID: {item.get('ean', 'N/A')}")
            print(f"Title: {item.get('title', 'N/A')}")
            print(f"Brand: {item.get('brand', 'N/A')}")
            
    except Exception as e:
        print(f"Exception while fetching product info: {e}")

def scan_barcode_realtime():
    cap = cv2.VideoCapture(0)
    scanned_barcodes = set()

    print("Press 'q' to quit.")

    while True:
        success, frame = cap.read()
        if not success:
            break

        barcodes = decode(frame)
        for barcode in barcodes:
            barcode_data = barcode.data.decode('utf-8')
            (x, y, w, h) = barcode.rect
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(frame, barcode_data, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 0), 2)

            if barcode_data not in scanned_barcodes:
                print(f"\nScanned UPC: {barcode_data}")
                scanned_barcodes.add(barcode_data)
                fetch_product_details(barcode_data)

        cv2.imshow("Real-Time Barcode Scanner", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    scan_barcode_realtime()

import requests
import json

API_BASE = 'https://tinhthanhpho.com/api/v1'

def test_new_provinces_api():
    """Test the new provinces API to see the actual response"""
    url = f"{API_BASE}/new-provinces"
    
    print(f"Testing URL: {url}")
    
    # Test without pagination first
    response = requests.get(url, timeout=30)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Response keys: {list(data.keys())}")
        
        if 'data' in data:
            provinces = data['data']
            print(f"Number of provinces in response: {len(provinces)}")
            print(f"First 5 provinces:")
            for i, prov in enumerate(provinces[:5]):
                print(f"  {i+1}. {prov['code']}: {prov['name']} ({prov['type']})")
            
            # Check if there's pagination info
            if 'meta' in data:
                print(f"Meta info: {data['meta']}")
            
            # Test with pagination
            print("\nTesting with pagination...")
            url_with_page = f"{url}?page=1&per_page=100"
            response2 = requests.get(url_with_page, timeout=30)
            if response2.status_code == 200:
                data2 = response2.json()
                if 'data' in data2:
                    print(f"With pagination - Number of provinces: {len(data2['data'])}")
                    if 'meta' in data2:
                        print(f"Meta with pagination: {data2['meta']}")
        else:
            print(f"Full response: {json.dumps(data, indent=2)}")
    else:
        print(f"Error: {response.text}")

if __name__ == "__main__":
    test_new_provinces_api() 
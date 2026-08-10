def romanToInt(s: str) -> int:
    # 1. Định nghĩa bảng giá trị
    roman_map = {
        'I': 1,
        'V': 5,
        'X': 10,
        'L': 50,
        'C': 100,
        'D': 500,
        'M': 1000
    }
    
    total = 0
    n = len(s)
    
    # 2. Duyệt qua từng ký tự trong chuỗi
    for i in range(n):
        # Lấy giá trị của ký tự hiện tại
        current_val = roman_map[s[i]]
        
        # Nếu không phải ký tự cuối cùng và giá trị hiện tại < giá trị kế tiếp
        if i < n - 1 and current_val < roman_map[s[i + 1]]:
            total -= current_val
        else:
            total += current_val
            
    return total

# Kiểm tra thử
print(f"III -> {romanToInt('III')}")      # Kết quả: 3
print(f"LVIII -> {romanToInt('LVIII')}")  # Kết quả: 58
print(f"MCMXCIV -> {romanToInt('MCMXCIV')}") # Kết quả: 1994
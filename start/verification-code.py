from PIL import Image, ImageDraw, ImageFont
from random import randint

white = (255, 255, 255)
black = (0, 0, 0)
font_image_size = 40

def get_code():
    ret = []
    code_arr = []
    def char(start, end):
        for i in range(ord(start), ord(end) + 1):
            code_arr.append(chr(i))
    
    char("0", "9")
    char("a", "z")
    char("A", "Z")
    
    for i in range(0, 4):
        index = randint(0, len(code_arr) - 1)
        
        ret.append(code_arr[index])
    
    return ret

def gen_code_img():
    chars = get_code()
    code_image = Image.new("RGB", (150, 60), white)
    
    print(chars)

    fnt = ImageFont.truetype("./fonts/code.ttf", 25)

    for (i, c) in enumerate(chars):
        char_img = Image.new("RGB", (font_image_size, font_image_size), white)
        char = ImageDraw.Draw(char_img)
        deg = randint(-45, 45)

        char.text((8, 0), c, font=fnt, fill=black)

        code_image.paste(
            char_img.rotate(deg, fillcolor=white),
            (font_image_size * i, 5)
        )
    
    return code_image

code_image = gen_code_img()

code_image.show()

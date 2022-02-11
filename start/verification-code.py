from PIL import Image, ImageDraw, ImageFont
from random import randint
from io import BytesIO
from base64 import b64encode

white = (255, 255, 255)
black = (0, 0, 0)
char_width = 30
char_height = 40
img_width = 130
img_height = 60

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
    code_image = Image.new("RGB", (img_width, img_height), white)

    def draw_line():
        xy = []

        for i in range(0, 15):
            xy.append(
                (randint(0, img_width), randint(0, img_height))
            )
        
        d = ImageDraw.Draw(code_image)
        d.line(xy, fill=black, width=1)
        
    print(chars)

    fnt = ImageFont.truetype("./fonts/code.ttf", 25)

    for (i, c) in enumerate(chars):
        char_img = Image.new("RGBA", (char_width, char_height), white)
        char = ImageDraw.Draw(char_img)
        deg = randint(-45, 45)

        char.text((8, 0), c, font=fnt, fill=black)

        code_image.paste(
            char_img.rotate(deg, fillcolor=white),
            (char_width * i, 5)
        )
     
    draw_line()

    return code_image

def img2base64(image):
    PREFIX = "data:image/jpeg;base64,"
    file = BytesIO()
    image.save(file, "JPEG")
    img_str = b64encode(file.getvalue()).decode()
    
    return f"{PREFIX}{img_str}"

code_image = gen_code_img()

print(img2base64(code_image))

code_image.show()

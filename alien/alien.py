import pygame
from pygame.sprite import Sprite
from os import path
from screen import screen

class Alien(Sprite):
    def __init__(self):
        super().__init__()
        img_dir = path.dirname(__file__)
        self.image = pygame.image.load(path.join(img_dir, "./images/alien.bmp"))
        self.rect = self.image.get_rect()
        self.rect.x = self.rect.width
        self.rect.y = self.rect.height

        self.x = float(self.rect.x)
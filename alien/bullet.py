import pygame
from pygame.sprite import Sprite
from settings import Settings
from screen import screen


class Bullet(Sprite):
    def __init__(self):
        super().__init__()

        self.color = Settings.bullet_color
        self.rect = pygame.Rect(0, 0, Settings.bullet_width, Settings.bullet_height)
        self.rect.midtop = ai_game.ship.rect.midtop

        self.y = float(self.rect.y)
    
    def update(self):
        self.y -= Settings.bullet_speed
        self.rect.y = self.y

    def draw_bullet(self):
        pygame.draw.rect(screen, self.color, self.rect)
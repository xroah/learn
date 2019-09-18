import pygame
from pygame.sprite import Sprite
from settings import Settings


class Bullet(Sprite):
    def __init__(self, ai_game):
        super().__init__()

        self.screen = ai_game.screen
        self.settings = ai_game.screen
        self.color = Settings.bullet_color
        self.rect = pygame.Rect(0, 0, Settings.bullet_width, Settings.bullet_height)
        self.rect.midtop = ai_game.ship.rect.midtop

        self.y = float(self.rect.y)
    
    def update(self):
        self.y -= Settings.bullet_speed
        self.rect.y = self.y

    def draw_bullet(self):
        pygame.draw.rect(self.screen, self.color, self.rect)
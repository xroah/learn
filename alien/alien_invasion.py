import sys
import pygame
from ship import Ship
from settings import Settings

class AlienInvasion:
    def __init__(self):
        pygame.init()

        self.screen = pygame.display.set_mode((
            Settings.screen_width,
            Settings.screen_height
        ))

        pygame.display.set_caption("Alien Invasion")
        self.bg_color = Settings.bg_color

        self.ship = Ship(self)

    def run_game(self):
        while True:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    sys.exit()
            
            self.screen.fill(self.bg_color)
            self.ship.blitme()
            pygame.display.flip()

if __name__ == "__main__":
    ai = AlienInvasion()
    ai.run_game()
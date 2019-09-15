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

        self.ship = Ship(self)

    def run_game(self):
        while True:
            self._check_events()
            self._update_screen()
            self.ship.update()

    def _check_events(self):
        for event in pygame.event.get():
            type = event.type

            if type == pygame.QUIT:
                sys.exit()
            elif type == pygame.KEYDOWN:
                self._check_keydown_events()
            elif type == pygame.KEYUP:
                self._check_keyup_events()

    def _check_keydown_events(self, event):
        self.ship.moving_right = event.key == pygame.K_RIGHT
        self.ship.moving_left = event.key == pygame.K_LEFT

    def _check_keyup_events(self, event):
        if event.key == pygame.K_RIGHT:
            self.ship.moving_right = False
        elif event.key == pygame.K_LEFT:
            self.ship.moving_left = False

    def _update_screen(self):
        self.screen.fill(Settings.bg_color)
        self.ship.blitme()
        pygame.display.flip()


if __name__ == "__main__":
    ai = AlienInvasion()
    ai.run_game()

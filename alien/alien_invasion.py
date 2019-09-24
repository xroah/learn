import sys
import pygame
from ship import Ship
from settings import Settings
from bullet import Bullet


class AlienInvasion:
    def __init__(self):
        pygame.init()
        self.screen = pygame.display.set_mode((
            Settings.screen_width,
            Settings.screen_height
        ))
        
        pygame.display.set_caption("Alien Invasion")

        self.ship = Ship(self)
        self.bullets = pygame.sprite.Group()
        
    def run_game(self):
        while True:
            self._check_events()
            self._update_screen()
            self.ship.update()
            self._update_bullets()

    def _fire_bullet(self):
        if len(self.bullets) >= Settings.bullets_allowed:
            return

        new_bullet = Bullet(self)

        self.bullets.add(new_bullet)

    def _update_bullets(self):
        self.bullets.update()

        for bullet in self.bullets.copy():
            if bullet.rect.bottom <= 0:
                self.bullets.remove(bullet)

    def _check_events(self):
        for event in pygame.event.get():
            e_type = event.type

            if e_type == pygame.QUIT:
                sys.exit()
            elif e_type == pygame.KEYDOWN:
                self._check_keydown_events(event)
            elif e_type == pygame.KEYUP:
                self._check_keyup_events(event)

    def _check_keydown_events(self, event):
        key = event.key

        self.ship.moving_right = key == pygame.K_RIGHT
        self.ship.moving_left = key == pygame.K_LEFT
        self.ship.moving_up = key == pygame.K_UP
        self.ship.moving_down = key == pygame.K_DOWN

        if key == pygame.K_q:
            sys.exit()
        elif key == pygame.K_SPACE:
            self._fire_bullet()

    def _check_keyup_events(self, event):
        key = event.key

        if key == pygame.K_RIGHT:
            self.ship.moving_right = False
        elif key == pygame.K_LEFT:
            self.ship.moving_left = False
        elif key == pygame.K_UP:
            self.ship.moving_up = False
        elif key == pygame.K_DOWN:
            self.ship.moving_down = False

    def _update_screen(self):
        self.screen.fill(Settings.bg_color)
        self.ship.blitme()
        for bullet in self.bullets.sprites():
            bullet.draw_bullet()
        pygame.display.flip()

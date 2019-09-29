import sys
import pygame
from ship import Ship
from settings import Settings
from bullet import Bullet
from alien import Alien
from screen import screen


class AlienInvasion:
    def __init__(self):
        pygame.init()
        pygame.display.set_caption("Alien Invasion")

        self.ship = Ship()
        self.bullets = pygame.sprite.Group()
        self.aliens = pygame.sprite.Group()

        self._create_fleet()
        self.run_game()

    def run_game(self):
        while True:
            self._check_events()
            self._update_screen()
            self.ship.update()
            self._update_bullets()

    def _fire_bullet(self):
        if len(self.bullets) >= Settings.bullets_allowed:
            return

        new_bullet = Bullet()

        self.bullets.add(new_bullet)

    def _update_bullets(self):
        self.bullets.update()

        for bullet in self.bullets.copy():
            if bullet.rect.bottom <= 0:
                self.bullets.remove(bullet)

    def _create_alien(self, alien_number):
        alien = Alien()
        alien_width = alien.rect.width
        alien.x = alien_width + 2 * alien_width * alien_number
        alien.rect.x = alien.x
        self.aliens.add(alien)

    def _create_fleet(self):
        alien = Alien()
        alien_width = alien.rect.width
        available_space_x = Settings.screen_width - alien_width
        number_aliens_x = available_space_x // (2 * alien_width)

        for alien_number in range(number_aliens_x):
            self._create_alien(alien_number)

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
        screen.fill(Settings.bg_color)
        self.ship.blitme()
        for bullet in self.bullets.sprites():
            bullet.draw_bullet()
        self.aliens.draw(screen)
        pygame.display.flip()

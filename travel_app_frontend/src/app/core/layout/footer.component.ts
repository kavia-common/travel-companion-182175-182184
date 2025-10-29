import { Component } from '@angular/core';

/**
 * PUBLIC_INTERFACE
 * FooterComponent renders the application footer with copyright.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="container">
        <p>&copy; {{ year }} Travel Companion · <span class="accent">Plan, Discover, Book</span></p>
      </div>
    </footer>
  `,
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  // PUBLIC_INTERFACE
  year = new Date().getFullYear();
}

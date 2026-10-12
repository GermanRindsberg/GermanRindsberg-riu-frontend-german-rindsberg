import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';

import { LoadingService } from './core/interceptors/loading.interceptor';

@Component({
  imports: [RouterOutlet, NgxSonnerToaster],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly loading = inject(LoadingService);

  constructor() {
    effect((onCleanup) => {
      if (!this.loading.active()) {
        return;
      }

      const overlay = document.createElement('div');
      overlay.className = 'app-loading';
      overlay.setAttribute('popover', 'manual');
      overlay.setAttribute('role', 'status');
      overlay.innerHTML = '<span class="app-spinner"></span>';
      document.body.appendChild(overlay);
      overlay.showPopover();

      onCleanup(() => overlay.remove());
    });
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    cc = 'QWxleGFuZGVyIE5lc3RlciCpIDIwMjQ=';
    vr = 'RGF0c3kgQW5ndWxhciAtIHZlcnNpb24gMDUxODI0';

    normalize(str): string {
        return atob(str)
    }
}
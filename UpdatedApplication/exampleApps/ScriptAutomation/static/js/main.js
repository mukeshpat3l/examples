(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "mat-sidenav-container, mat-sidenav-content, mat-sidenav {\n    height: 100%;\n  }\n\n  mat-sidenav {\n    width: 250px;\n  }\n\n  a {\n    text-decoration: none;\n    color: white;\n  }\n\n  a:hover,\n  a:active {\n    color: lightgray;\n  }\n\n  .navigation-items {\n    list-style: none;\n    padding: 0;\n    margin: 0;\n    cursor: pointer;\n}\n\n  .icon {\n    display: inline-block;\n    height: 30px;\n    margin: 0 auto;\n    padding-right: 5px;\n    text-align: center;\n    vertical-align: middle;\n    width: 15%;\n}\n\n  .label {\n    display: inline-block;\n    line-height: 30px;\n    margin: 0;\n    width: 85%;\n}\n\n  .example-spacer {\n    flex: 1 1 auto;\n}\n\n  .example-form {\n    min-width: 150px;\n    max-width: 700px;\n}\n\n  .example-form-field-host {\n    padding: 20px;\n    color: white;\n}\n\n  .example-form-field-token {\n    padding: 20px;\n    min-width: 350px;\n    color: white;\n}\n\n  mat-toolbar-row {\n    height: 85px !important;\n}\n\n  .logo{\n    margin-top: 10px;\n}\n"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-toolbar style=\"background-color:  #494949;\">\n  <mat-toolbar-row class=\"mat-elevation-z6\">\n    <img src=\"/static/js/assets/img/logo.png\" width=\"150px\" height=\"60px\">\n    <span class=\"example-spacer\"></span>\n    <form class=\"example-form\">\n      <mat-form-field class=\"example-form-field-host\" >\n        <input matInput placeholder=\"Host\" [(ngModel)]=\"host\" name=\"hostUrl\">\n      </mat-form-field>\n      <mat-form-field class=\"example-form-field-token\">\n        <input matInput placeholder=\"Token\" [(ngModel)]=\"token\" name=\"apiToken\">\n      </mat-form-field>\n    </form>\n    <button mat-raised-button style=\"background-color: #FF9E00\" (click)=\"connect()\">Connect</button>\n  </mat-toolbar-row>\n</mat-toolbar>\n<router-outlet></router-outlet>\n<ng4-loading-spinner> </ng4-loading-spinner>"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "../../../../node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./services/data.service */ "./src/app/services/data.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



var httpOptions = {
    headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({
        'Content-Type': 'application/json'
    })
};
var AppComponent = /** @class */ (function () {
    function AppComponent(http, dataService) {
        this.http = http;
        this.dataService = dataService;
        this.validHostAndToken = false;
    }
    AppComponent.prototype.delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    AppComponent.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.host != null && !this.host.includes("https://"))
                    this.finalHost = "https://" + this.host;
                else
                    this.finalHost = this.host;
                console.log(this.host);
                console.log(this.token);
                sessionStorage.setItem("host", this.finalHost);
                sessionStorage.setItem("token", this.token);
                try {
                    this.dataService.getAssesments(this.finalHost, this.token).subscribe(function (assesments) {
                        alert("Connected!");
                        sessionStorage.setItem("connected", JSON.stringify(true));
                        _this.http.post("http://127.0.0.1:8000/index/", JSON.stringify({ host: _this.finalHost, token: _this.token }), httpOptions).subscribe();
                    }, function (err) {
                        console.log("error");
                        alert("Couldn't connect with this host and token");
                    });
                }
                catch (err) {
                }
                return [2 /*return*/];
            });
        });
    };
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"], _services_data_service__WEBPACK_IMPORTED_MODULE_2__["DataService"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _material_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./material.module */ "./src/app/material.module.ts");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "../../../../node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/http */ "../../../../node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/platform-browser/animations */ "../../../../node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/flex-layout */ "../../../../node_modules/@angular/flex-layout/esm5/flex-layout.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "../../../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ "../../../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common/http */ "../../../../node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _home_home_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./home/home.component */ "./src/app/home/home.component.ts");
/* harmony import */ var _example_example_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./example/example.component */ "./src/app/example/example.component.ts");
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var d3_ng2_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! d3-ng2-service */ "../../../../node_modules/d3-ng2-service/index.js");
/* harmony import */ var ng2_google_charts__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ng2-google-charts */ "../../../../node_modules/ng2-google-charts/index.js");
/* harmony import */ var ng4_loading_spinner__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ng4-loading-spinner */ "../../../../node_modules/ng4-loading-spinner/ng4-loading-spinner.umd.js");
/* harmony import */ var ng4_loading_spinner__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(ng4_loading_spinner__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var _user_user_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./user/user.component */ "./src/app/user/user.component.ts");
/* harmony import */ var angular_webstorage_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! angular-webstorage-service */ "../../../../node_modules/angular-webstorage-service/bundles/angular-webstorage-service.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


















var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_7__["AppComponent"],
                _home_home_component__WEBPACK_IMPORTED_MODULE_10__["HomeComponent"],
                _example_example_component__WEBPACK_IMPORTED_MODULE_11__["ExampleComponent"],
                _user_user_component__WEBPACK_IMPORTED_MODULE_16__["UserComponent"],
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__["BrowserAnimationsModule"],
                _material_module__WEBPACK_IMPORTED_MODULE_0__["MaterialModule"],
                _angular_http__WEBPACK_IMPORTED_MODULE_3__["HttpModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_9__["HttpClientModule"],
                _angular_flex_layout__WEBPACK_IMPORTED_MODULE_5__["FlexLayoutModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_8__["FormsModule"],
                ng2_google_charts__WEBPACK_IMPORTED_MODULE_14__["Ng2GoogleChartsModule"],
                angular_webstorage_service__WEBPACK_IMPORTED_MODULE_17__["StorageServiceModule"],
                ng4_loading_spinner__WEBPACK_IMPORTED_MODULE_15__["Ng4LoadingSpinnerModule"].forRoot(),
                _angular_router__WEBPACK_IMPORTED_MODULE_6__["RouterModule"].forRoot([
                    { path: '', component: _home_home_component__WEBPACK_IMPORTED_MODULE_10__["HomeComponent"] },
                    { path: 'example', component: _example_example_component__WEBPACK_IMPORTED_MODULE_11__["ExampleComponent"] },
                    { path: 'visualize', component: _user_user_component__WEBPACK_IMPORTED_MODULE_16__["UserComponent"] }
                ])
            ],
            providers: [_services_data_service__WEBPACK_IMPORTED_MODULE_12__["DataService"], d3_ng2_service__WEBPACK_IMPORTED_MODULE_13__["D3Service"]],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_7__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/example/example.component.css":
/*!***********************************************!*\
  !*** ./src/app/example/example.component.css ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container{\n    position:fixed;\n    top: 20%;\n    left: 40%;\n    align-items: center;\n}\n\nmat-card{\n    color: rgb(255, 153, 66);\n    border-radius: 8px;\n}\n\nmat-progress-bar{\n    position:fixed;\n    bottom: 15%;\n    width: 50%;\n    left: 25%;\n}\n\n::ng-deep .mat-progress-bar-fill::after {\n    background-color:rgb(221, 205, 189);\n}\n\n::ng-deep .mat-progress-bar-buffer {\n    background:rgb(255, 153, 66);\n}\n\n::ng-deep .mat-progress-bar {\n    border-radius: 2px;\n}\n\n::ng-deep .mat-spinner {\n    color: #4562E9;\n}\n\n.result{\n    position:fixed;\n    bottom: 10%;\n    width: 10%;\n    left: 43.5%;\n}\n\n.completed{\n    background-image: url('/ng-material-demo/src/assets/img/gr_tick.png');\n    width: 20px;\n    height: 20px;\n}\n\n.example-spacer {\n    flex: 1 1 auto;\n  }\n\n.viewResultsButton{\n    background-color: #4562E9;\n    color: white;\n}\n\n.delete{\n    position: fixed;\n    right: 5%;\n    top: 15%;\n    color: red;\n    height: 80px;\n    border-radius: 50px;\n}\n\n.example-name-card{\n    position: absolute;\n    left: 50px;\n    top: 18%;\n    max-width: 200px;\n    max-height: 70px;\n    color: #494949;\n}\n\nh2{\n    position: absolute;\n    left: 50px;\n    top: 12%;\n    color: #494949;\n    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;\n}"

/***/ }),

/***/ "./src/app/example/example.component.html":
/*!************************************************!*\
  !*** ./src/app/example/example.component.html ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- <img src=\"assets/img/delete.png\" width=\"50px\" height=\"50px\" class=\"delete\" (click)=\"deleteClicked()\" /> -->\n<div *ngIf=\"isInterrupted; then error else progress\"></div>\n<ng-template #error>\n  <h2>Oops! Something went wrong</h2>\n</ng-template>\n<ng-template #progress>\n  <button mat-button class=\"delete\" (click)=\"deleteClicked()\">\n    <mat-icon>delete</mat-icon>\n  </button>\n  <h2>{{ example }}</h2>\n  <div class=\"container\">\n    <div fxLayout=\"column\" fxLayout.xs=\"column\" fxLayoutGap=\"20px\" fxLayoutAlign=\"center stretch\">\n      <mat-card class=\"mat-elevation-z4\" fxFlex=\"20%\" fxFlex.xs=\"40%\" mat-ripple fxLayout=\"row\" fxLayoutGap=\"10px\">\n        <mat-list-item fxLayout=\"row\" fxLayoutAlign=\"center\">\n          <mat-card-content class=\"content\">\n            <h3>Creating datastream</h3>\n          </mat-card-content>\n        </mat-list-item>\n        <span class=\"example-spacer\"></span>\n        <mat-list-item fxLayoutAlign=\"center\">\n          <div *ngIf=\"dataStreamSpinner\">\n            <mat-spinner strokeWidth=\"2\" [diameter]=\"20\"></mat-spinner>\n          </div>\n          <div *ngIf=\"dataStreamCompleted\">\n            <img src=\"/static/js/assets/img/gr_tick.png\" width=\"20px\" height=\"20px\">\n          </div>\n        </mat-list-item>\n      </mat-card>\n      <mat-card class=\"mat-elevation-z4\" fxFlex=\"20%\" fxFlex.xs=\"40%\" mat-ripple fxLayout=\"row\" fxLayoutGap=\"10px\">\n        <mat-list-item fxLayout=\"row\" fxLayoutAlign=\"center\">\n          <mat-card-content class=\"content\">\n            <h3>Adding data and facts</h3>\n          </mat-card-content>\n        </mat-list-item>\n        <span class=\"example-spacer\"></span>\n        <mat-list-item fxLayoutAlign=\"center\">\n          <div *ngIf=\"addDataSpinner\">\n            <mat-spinner strokeWidth=\"2\" [diameter]=\"20\"></mat-spinner>\n          </div>\n          <div *ngIf=\"addDataCompleted\">\n            <img src=\"/static/js/assets/img/gr_tick.png\" width=\"20px\" height=\"20px\">\n          </div>\n        </mat-list-item>\n      </mat-card>\n      <mat-card class=\"mat-elevation-z4\" fxFlex=\"20%\" fxFlex.xs=\"40%\" mat-ripple fxLayout=\"row\" fxLayoutGap=\"10px\">\n        <mat-list-item fxLayout=\"row\" fxLayoutAlign=\"center\">\n          <mat-card-content class=\"content\">\n            <h3>Learning patterns</h3>\n          </mat-card-content>\n        </mat-list-item>\n        <span class=\"example-spacer\"></span>\n        <mat-list-item fxLayoutAlign=\"center\">\n          <div *ngIf=\"learningPatternSpinner\">\n            <mat-spinner strokeWidth=\"2\" [diameter]=\"20\"></mat-spinner>\n          </div>\n          <div *ngIf=\"learningPatternCompleted\">\n            <img src=\"/static/js/assets/img/gr_tick.png\" width=\"20px\" height=\"20px\">\n          </div>\n        </mat-list-item>\n      </mat-card>\n      <mat-card class=\"mat-elevation-z4\" fxFlex=\"20%\" fxFlex.xs=\"40%\" mat-ripple fxLayout=\"row\" fxLayoutGap=\"10px\">\n        <mat-list-item fxLayout=\"row\" fxLayoutAlign=\"center\">\n          <mat-card-content class=\"content\">\n            <h3>Starting live monitoring</h3>\n          </mat-card-content>\n        </mat-list-item>\n        <span class=\"example-spacer\"></span>\n        <mat-list-item fxLayoutAlign=\"center\">\n          <div *ngIf=\"liveMonitoringSpinner\">\n            <mat-spinner strokeWidth=\"2\" [diameter]=\"20\"></mat-spinner>\n          </div>\n          <div *ngIf=\"liveMonitoringCompleted\">\n            <img src=\"/static/js/assets/img/gr_tick.png\" width=\"20px\" height=\"20px\">\n          </div>\n        </mat-list-item>\n      </mat-card>\n      <div *ngIf=\"isCompleted; then viewResults else pb\"></div>\n      <ng-template #pb>\n        <mat-progress-bar mode=\"indeterminate\"></mat-progress-bar>\n      </ng-template>\n      <ng-template #viewResults>\n        <button mat-raised-button class=\"viewResultsButton\" routerLink=\"/visualize\">View Results</button>\n      </ng-template>\n    </div>\n  </div>\n</ng-template>\n"

/***/ }),

/***/ "./src/app/example/example.component.ts":
/*!**********************************************!*\
  !*** ./src/app/example/example.component.ts ***!
  \**********************************************/
/*! exports provided: ExampleComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExampleComponent", function() { return ExampleComponent; });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ "../../../../node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "../../../../node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



var httpOptions = {
    headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpHeaders"]({
        'Content-Type': 'application/json'
    })
};
var ExampleComponent = /** @class */ (function () {
    function ExampleComponent(http, router) {
        this.http = http;
        this.router = router;
        this.isCompleted = false;
        this.isDeleted = false;
        this.dataStreamCompleted = false;
        this.addDataCompleted = false;
        this.learningPatternCompleted = false;
        this.liveMonitoringCompleted = false;
        this.dataStreamSpinner = true;
        this.addDataSpinner = false;
        this.learningPatternSpinner = false;
        this.liveMonitoringSpinner = false;
        this.isInterrupted = false;
        this.data = [];
        this.notCompleted = true;
        if (sessionStorage.getItem("start")) {
            this.example = sessionStorage.getItem("example");
            sessionStorage.setItem("start", JSON.stringify(false));
            this.getStatus();
        }
        else
            this.router.navigate(['/']);
    }
    ExampleComponent.prototype.delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    ExampleComponent.prototype.getStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.notCompleted) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.delay(5000)];
                    case 1:
                        _a.sent();
                        this.http.get("http://127.0.0.1:8000/status/").map(function (res) { return res; }).subscribe(function (response) {
                            _this.data = response;
                            console.log(_this.data);
                            _this.dataStreamCompleted = _this.data[0]["datastream"];
                            _this.addDataCompleted = _this.data[0]["addFacts"];
                            _this.learningPatternCompleted = _this.data[0]["modelCreated"];
                            _this.liveMonitoringCompleted = _this.data[0]["liveMonitoring"];
                            _this.isInterrupted = _this.data[0]["isInterrupted"];
                            if (_this.isInterrupted)
                                _this.notCompleted = false;
                            else if (_this.liveMonitoringCompleted)
                                _this.disableAllSpinners();
                            else if (_this.learningPatternCompleted)
                                _this.setLiveMonitoringSpinner();
                            else if (_this.addDataCompleted)
                                _this.setLearningPatternSpinner();
                            else if (_this.dataStreamCompleted)
                                _this.setAddDataSpinner();
                        });
                        if (this.liveMonitoringCompleted) {
                            this.notCompleted = false;
                        }
                        return [3 /*break*/, 0];
                    case 2:
                        this.isCompleted = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    ExampleComponent.prototype.disableAllSpinners = function () {
        this.dataStreamSpinner = this.addDataSpinner = this.learningPatternSpinner = this.liveMonitoringSpinner = false;
    };
    ExampleComponent.prototype.setAddDataSpinner = function () {
        this.addDataSpinner = true;
        this.dataStreamSpinner = this.learningPatternSpinner = this.liveMonitoringSpinner = false;
    };
    ExampleComponent.prototype.setLearningPatternSpinner = function () {
        this.learningPatternSpinner = true;
        this.addDataSpinner = this.dataStreamSpinner = this.liveMonitoringSpinner = false;
    };
    ExampleComponent.prototype.setLiveMonitoringSpinner = function () {
        this.liveMonitoringSpinner = true;
        this.addDataSpinner = this.learningPatternSpinner = this.dataStreamSpinner = false;
    };
    ExampleComponent.prototype.deleteClicked = function () {
        this.http.get("http://127.0.0.1:8000/delete/").subscribe();
        this.notCompleted = false;
        this.router.navigate(['']);
        // this.isDeleted = true;
    };
    ExampleComponent.prototype.unloadHandler = function (event) {
        sessionStorage.removeItem("start");
        this.deleteClicked();
    };
    ExampleComponent.prototype.ngOnInit = function () {
        // this.deleteClicked();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["HostListener"])("window:beforeunload", ["$event"]),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Event]),
        __metadata("design:returntype", void 0)
    ], ExampleComponent.prototype, "unloadHandler", null);
    ExampleComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-example',
            template: __webpack_require__(/*! ./example.component.html */ "./src/app/example/example.component.html"),
            styles: [__webpack_require__(/*! ./example.component.css */ "./src/app/example/example.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpClient"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], ExampleComponent);
    return ExampleComponent;
}());



/***/ }),

/***/ "./src/app/home/home.component.css":
/*!*****************************************!*\
  !*** ./src/app/home/home.component.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "a {\n    text-decoration: none;\n    color: white;\n  }\n\n  a:hover,\n  a:active {\n    color: lightgray;\n  }\n\n  .navigation-items {\n    list-style: none;\n    padding: 0;\n    margin: 0;\n    cursor: pointer;\n  }\n\n  .icon {\n    display: inline-block;\n    height: 30px;\n    margin: 0 auto;\n    padding-right: 5px;\n    text-align: center;\n    vertical-align: middle;\n    width: 15%;\n  }\n\n  .label {\n    display: inline-block;\n    line-height: 30px;\n    margin: 0;\n    width: 85%;\n  }\n\n  .container {\n    padding: 10px;\n}\n\n  .example-spacer {\n    flex: 1 1 auto;\n}\n\n  .example-form {\n    min-width: 150px;\n    max-width: 500px;\n}\n\n  .example-padding {\n    padding: 10px;\n}\n\n  .example-card {\n    width: 30%;\n    margin: 15%;\n}\n\n  mat-card {\n    border-radius: 8px;\n    margin-top: 15%;\n}\n\n  mat-toolbar-row {\n    height: 85px !important;\n}\n\n  .startButton{\n    background-color: #4562E9;\n    color: white;\n}\n"

/***/ }),

/***/ "./src/app/home/home.component.html":
/*!******************************************!*\
  !*** ./src/app/home/home.component.html ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n  <div fxLayout=\"row\" fxLayout.xs=\"column\" fxLayoutGap=\"40px\" fxLayoutAlign=\"center stretch\">\n      <mat-card fxFlex=\"20%\" fxFlex.xs=\"40%\" mat-ripple class=\"mat-elevation-z6\">\n          <mat-list-item fxLayout=\"row\" fxLayoutAlign=\"center\">\n            <mat-card-content>\n              <h2>Machine</h2>\n            </mat-card-content>\n          </mat-list-item>\n          <mat-list-item fxLayout=\"row\" fxLayoutAlign=\"center\">\n            <button mat-raised-button (click)=\"selectExample('Machine')\" class=\"startButton\"><strong>Start</strong></button>\n          </mat-list-item>\n        </mat-card>\n      <mat-card fxFlex=\"20%\" fxFlex.xs=\"40%\" mat-ripple class=\"mat-elevation-z6\">\n        <mat-list-item fxLayout=\"row\" fxLayoutAlign=\"center\">\n          <mat-card-content>\n            <h2>Weather</h2>\n          </mat-card-content>\n        </mat-list-item>\n        <mat-list-item fxLayout=\"row\" fxLayoutAlign=\"center\">\n          <button mat-raised-button (click)=\"selectExample('Weather')\" class=\"startButton\"><strong>Start</strong></button>  \n        </mat-list-item>\n      </mat-card>\n    </div>\n</div>\n"

/***/ }),

/***/ "./src/app/home/home.component.ts":
/*!****************************************!*\
  !*** ./src/app/home/home.component.ts ***!
  \****************************************/
/*! exports provided: HomeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomeComponent", function() { return HomeComponent; });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ "../../../../node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "../../../../node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var httpOptions = {
    headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpHeaders"]({
        'Content-Type': 'application/json'
    })
};
var HomeComponent = /** @class */ (function () {
    function HomeComponent(http, router) {
        this.http = http;
        this.router = router;
        this.someThing = true;
    }
    HomeComponent.prototype.ngOnInit = function () {
    };
    HomeComponent.prototype.selectExample = function (example) {
        this.connected = sessionStorage.getItem("connected");
        console.log(this.connected);
        this.host = sessionStorage.getItem("host");
        this.token = sessionStorage.getItem("token");
        if (this.connected) {
            sessionStorage.setItem("start", JSON.stringify(true));
            if (example == "Machine") {
                this.http.post("http://127.0.0.1:8000/example/", JSON.stringify({ host: this.host,
                    token: this.token,
                    example: 1 }), httpOptions).subscribe();
            }
            else if (example == "Weather") {
                this.http.post("http://127.0.0.1:8000/example/", JSON.stringify({ host: this.host,
                    token: this.token,
                    example: 2 }), httpOptions).subscribe();
            }
            sessionStorage.setItem("example", example);
            this.router.navigate(['example']);
        }
        else
            alert("Please Enter a valid host and token");
    };
    HomeComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-home',
            template: __webpack_require__(/*! ./home.component.html */ "./src/app/home/home.component.html"),
            styles: [__webpack_require__(/*! ./home.component.css */ "./src/app/home/home.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpClient"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], HomeComponent);
    return HomeComponent;
}());



/***/ }),

/***/ "./src/app/material.module.ts":
/*!************************************!*\
  !*** ./src/app/material.module.ts ***!
  \************************************/
/*! exports provided: MaterialModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MaterialModule", function() { return MaterialModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "../../../../node_modules/@angular/material/esm5/material.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var MaterialModule = /** @class */ (function () {
    function MaterialModule() {
    }
    MaterialModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSidenavModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatToolbarModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatIconModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatListModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatButtonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatCardModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatMenuModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatInputModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatRippleModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatFormFieldModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatProgressBarModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSelectModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatOptionModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatProgressSpinnerModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogModule"]
            ],
            exports: [
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSidenavModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatToolbarModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatIconModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatListModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatButtonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatCardModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatMenuModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatInputModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatRippleModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatFormFieldModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatProgressBarModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSelectModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatOptionModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatProgressSpinnerModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogModule"]
            ]
        })
    ], MaterialModule);
    return MaterialModule;
}());



/***/ }),

/***/ "./src/app/services/data.service.ts":
/*!******************************************!*\
  !*** ./src/app/services/data.service.ts ***!
  \******************************************/
/*! exports provided: DataService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataService", function() { return DataService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/http */ "../../../../node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var rxjs_add_operator_map__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/add/operator/map */ "../../../../node_modules/rxjs-compat/_esm5/add/operator/map.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var DataService = /** @class */ (function () {
    function DataService(http) {
        this.http = http;
        this.headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        console.log("Data service connected");
        var obj;
    }
    DataService.prototype.getLiveJSON = function () {
    };
    DataService.prototype.getJson = function () {
        var data = '[{"time":"1509954840000", "entity": "P123", "value":"1"},'
            + '{"time":"1509954841000", "entity": "P123", "value":"3"},'
            + '{"time":"1509954842000", "entity": "P123", "value":"2"},'
            + '{"time":"1509954843000", "entity": "P123", "value":"2"},'
            + '{"time":"1509954844000", "entity": "P123", "value":"2"},'
            + '{"time":"1509954845000", "entity": "P123", "value":"1"},'
            + '{"time":"1509954846000", "entity": "P123", "value":"2"},'
            + '{"time":"1509954847000", "entity": "P123", "value":"1"},'
            + '{"time":"1509954848000", "entity": "P123", "value":"1"},'
            + '{"time":"1509954849000", "entity": "P123", "value":"2"},'
            + '{"time":"1509954850000", "entity": "P123", "value":"2"},'
            + '{"time":"1509954851000", "entity": "P123", "value":"3"},'
            + '{"time":"1509954852000", "entity": "P123", "value":"3"},'
            + '{"time":"1509954853000", "entity": "P123", "value":"1"},'
            + '{"time":"1509954854000", "entity": "P123", "value":"1"},'
            + '{"time":"1509954855000", "entity": "P123", "value":"2"}'
            + ']';
        return data;
    };
    DataService.prototype.getAssesments = function (host, api_key) {
        var _this = this;
        this.headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        host = host + "/assessment";
        this.headers.set("Authorization", "Bearer ".concat(api_key));
        this.options = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["RequestOptions"]({ headers: this.headers });
        return this.http.get(host, this.options).map(function (result) { return _this.result = result.json(); });
    };
    DataService.prototype.getDatastream = function (host, api_key, datastream_id) {
        var _this = this;
        this.headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        host = host + "/datastream/" + datastream_id;
        this.headers.set("Authorization", "Bearer ".concat(api_key));
        this.options = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["RequestOptions"]({ headers: this.headers });
        return this.http.get(host, this.options).map(function (result) { return _this.result = result.json(); });
    };
    DataService.prototype.getEntityMeta = function (host, api_key, datastream_id) {
        var _this = this;
        this.headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]();
        host = host + "/datastream/" + datastream_id + "/entityMeta";
        this.headers.set("Authorization", "Bearer ".concat(api_key));
        this.options = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["RequestOptions"]({ headers: this.headers });
        return this.http.get(host, this.options).map(function (result) { return _this.result = result.json(); });
    };
    DataService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_1__["Http"]])
    ], DataService);
    return DataService;
}());



/***/ }),

/***/ "./src/app/user/user.component.css":
/*!*****************************************!*\
  !*** ./src/app/user/user.component.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".graphs\n{   \n    margin:15px;\n    padding:5px;\n}\n\n.example-name-card{\n    left: 50px;\n    top: 20px;\n    border-radius: 8px;\n    max-width: 200px;\n    max-height: 70px;\n    color: #494949;\n}\n\n.example-spacer {\n    flex: 1 1 auto;\n}\n\n.goHome{\n    position: absolute;\n    right: 5%;\n    top: 15%;\n}\n\nh2{\n    position: absolute;\n    left: 50px;\n    top: 12%;\n    color: #494949;\n    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;\n}\n\n"

/***/ }),

/***/ "./src/app/user/user.component.html":
/*!******************************************!*\
  !*** ./src/app/user/user.component.html ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div fxLayoutGap=\"30px\" fxLayout=\"column\">\n  <div fxLayout=\"row\">\n    <!-- <mat-card class=\"example-name-card mat-elevation-z6\" fxLayoutAlign=\"center center\">\n      <mat-card-content class=\"content\">\n        <h2>{{ example }}</h2>\n      </mat-card-content>\n    </mat-card> -->\n    <h2>{{ example }}</h2>\n\n    <button mat-raised-button class=\"goHome\" (click)=\"goToHome()\">Go to Home</button>\n  </div>\n\n  <div class=\"graphs\">\n    <h3 [hidden]=\"loaderEnabled || selectedEntity==null\">{{selectedEntity}}</h3>\n    <google-chart #ctchart [data]=\"columnChartData\" (chartError)='error_column($event)'></google-chart>\n  </div>\n  <div class=\"graphs\" fxLayoutAlign=\"center center\">\n    <google-chart #cchart [data]=\"timelineChartData\" (chartError)='error_timeline($event)'></google-chart>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/user/user.component.ts":
/*!****************************************!*\
  !*** ./src/app/user/user.component.ts ***!
  \****************************************/
/*! exports provided: UserComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserComponent", function() { return UserComponent; });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ "../../../../node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ng_event_source__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ng-event-source */ "../../../../node_modules/ng-event-source/eventsource.js");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! underscore */ "../../../../node_modules/underscore/underscore.js");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! jquery */ "../../../../node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "../../../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var ng4_loading_spinner__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ng4-loading-spinner */ "../../../../node_modules/ng4-loading-spinner/ng4-loading-spinner.umd.js");
/* harmony import */ var ng4_loading_spinner__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(ng4_loading_spinner__WEBPACK_IMPORTED_MODULE_7__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};









var randomColor = __webpack_require__(/*! randomcolor */ "../../../../node_modules/randomcolor/randomColor.js");
var UserComponent = /** @class */ (function () {
    function UserComponent(dataService, http, router, spinnerService) {
        var _this = this;
        this.dataService = dataService;
        this.http = http;
        this.router = router;
        this.spinnerService = spinnerService;
        this.html = "\n    <table style=\"width:100%;border:1px solid #ddd;\">\n    <tr style=\"background-color:beige\">\n        <td style=\"border-bottom: 1px solid #ddd;padding:5px\">Label</td>\n        <td style=\"border-bottom: 1px solid #ddd;padding:5px\">Unlabeled 1</td>\n    </tr>\n    <tr >\n        <td style=\"border-bottom: 1px solid #ddd;padding:5px\">Start</td>\n        <td style=\"border-bottom: 1px solid #ddd;padding:5px\">6/12/2017</td>\n    </tr>\n    <tr>\n        <td style=\"padding:5px;\">End</td>\n        <td style=\"padding:5px;\">7/12/2017</td>\n    </tr>\n    </table>\n  ";
        this.colors = {};
        this.fetched_assessments = [];
        this.selectedAssessment = null;
        this.selectedEntity = null;
        this.assessment_entity_map = {};
        this.assessment_map = {};
        this.assessment_data_map = {};
        this.loaderEnabled = false;
        this.assessment_datastream_map = {};
        this.datastreamList = [];
        this.datastream_entity_meta_map = {};
        this.datastream_entitymeta_label_map = {};
        this.columnChartData = {
            chartType: 'ColumnChart',
            dataTable: [[{ type: 'string', id: "Label" }, { type: 'number', id: "Frequency" }, { role: 'style' }]],
            options: {
                'title': 'Distribution of Conditions Over Time',
                'height': window.screen.availHeight * 0.4, 'width': window.screen.availWidth * 0.4,
                'vAxis': { maxValue: 100, minValue: 0 },
                'titleTextStyle': { fontName: "Calibri", fontSize: 17 },
                legend: { position: "none" }
            },
        };
        this.timelineChartData = {
            chartType: 'Timeline',
            dataTable: [
                [{ type: 'string', id: "Type" },
                    { type: 'string', id: "Class", label: "" },
                    { type: 'string', role: 'tooltip', 'p': { 'html': true } },
                    { type: 'datetime', id: "Start" }, { type: 'datetime', id: "End" }
                ],
                ["Condition", "Label X", this.generate_custom_HTML("Unlabeled X", new Date(Date.now()), new Date(Date.now())), Date.now(), new Date(Date.now() + 14400000)]
            ],
            groupByRowLabel: false,
            options: {
                timelines: { showRowLabels: false },
                title: 'Timeline',
                colors: ["white"],
                height: 300, width: window.screen.availWidth * 0.9,
                timeline: { showBarLabels: false },
                tooltip: { isHtml: true, trigger: 'focus' },
                hAxis: {
                    format: 'M/d/yy HH:mm:ss',
                    viewWindow: {
                        min: new Date(Date.now()),
                        max: new Date(Date.now() + 244)
                    },
                }
            }
        };
        this.host = sessionStorage.getItem("host");
        this.token = sessionStorage.getItem("token");
        this.example = sessionStorage.getItem("example");
        console.log(this.host);
        console.log(this.token);
        this.http.get("http://127.0.0.1:8000/status/").map(function (res) { return res; }).subscribe(function (response) {
            _this.selectedAssessment = response[0]["assessmentId"];
            console.log(_this.selectedAssessment);
        });
        this.getAssessments();
        this.plotGraph();
    }
    UserComponent.prototype.delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    UserComponent.prototype.plotGraph = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.delay(3000)];
                    case 1:
                        _a.sent();
                        this.getLiveData();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserComponent.prototype.changeData2 = function () {
        jquery__WEBPACK_IMPORTED_MODULE_4__(".google-visualization-tooltip").remove();
        this.timeline_chart.redraw();
        this.column_chart.redraw();
    };
    UserComponent.prototype.getLiveData = function () {
        var _this = this;
        var eventSourceInitDict = { headers: { Authorization: "Bearer ".concat(this.token) } };
        this.URL = this.host + "/assessment/" + this.selectedAssessment + "/output";
        var output = new ng_event_source__WEBPACK_IMPORTED_MODULE_2__["EventSourcePolyfill"](this.URL, eventSourceInitDict);
        this.output = output;
        var counter = 0;
        this.http.get("http://127.0.0.1:8000/viewResults/").subscribe();
        output.onmessage = function (evt) {
            _this.spinnerService.hide();
            var data = evt.data;
            var json_data = JSON.parse(data);
            console.log(data);
            var entity = json_data['entity'];
            console.log(entity);
            if (_this.datastream_entity_meta_map[_this.assessment_map[_this.selectedAssessment].datastream].length) {
                entity = _this.datastream_entitymeta_label_map[_this.assessment_map[_this.selectedAssessment].datastream][json_data["entity"]];
            }
            if (!_this.assessment_entity_map[_this.selectedAssessment].includes(entity)) {
                _this.assessment_entity_map[_this.selectedAssessment].push(entity);
                _this.assessment_data_map[_this.selectedAssessment][entity] = [];
            }
            var flag_for_duplicate = 0;
            _this.assessment_data_map[_this.selectedAssessment][entity].forEach(function (element) {
                if (element["time"] == json_data["time"]) {
                    flag_for_duplicate = 1;
                }
            });
            if (flag_for_duplicate == 0) {
                _this.assessment_data_map[_this.selectedAssessment][entity].push(json_data);
                console.log(_this.assessment_data_map[_this.selectedAssessment][entity]);
                counter = counter + 1;
            }
            if (!_this.selectedEntity) {
                _this.selectedEntity = entity;
            }
            if (counter % 5 == 0 && _this.selectedEntity != null) {
                _this.update_color_list(_this.assessment_data_map[_this.selectedAssessment][_this.selectedEntity]);
                _this.update_ColumnChart(_this.assessment_data_map[_this.selectedAssessment][_this.selectedEntity]);
                _this.update_TimeLineChart(_this.assessment_data_map[_this.selectedAssessment][_this.selectedEntity], _this.assessment_datastream_map[_this.assessment_map[_this.selectedAssessment].datastream].timePrecision);
                _this.timelineChartData.options.colors = [];
                Object.values(_this.colors).forEach(function (element) {
                    _this.timelineChartData.options.colors.push(String(element));
                });
                console.log(_this.assessment_data_map);
                console.log(_this.assessment_entity_map);
                _this.changeData2();
                _this.loaderEnabled = false;
            }
        };
    };
    UserComponent.prototype.draw_charts_for_selectedEntity = function (entity) {
        var _this = this;
        this.selectedEntity = entity;
        if (this.assessment_data_map[this.selectedAssessment][this.selectedEntity] && this.assessment_entity_map[this.selectedAssessment]) {
            this.assessment_entity_map[this.selectedAssessment].forEach(function (element) {
                _this.assessment_data_map[_this.selectedAssessment][element] = [];
            });
            this.update_color_list(this.assessment_data_map[this.selectedAssessment][this.selectedEntity]);
            this.update_ColumnChart(this.assessment_data_map[this.selectedAssessment][this.selectedEntity]);
            this.update_TimeLineChart(this.assessment_data_map[this.selectedAssessment][this.selectedEntity], this.assessment_datastream_map[this.assessment_map[this.selectedAssessment].datastream].timePrecision);
            this.timelineChartData.options.colors = [];
            Object.values(this.colors).forEach(function (element) {
                _this.timelineChartData.options.colors.push(String(element));
            });
        }
        this.changeData2();
    };
    UserComponent.prototype.getAssessments = function () {
        var _this = this;
        this.spinnerService.show();
        console.log(this.host);
        console.log(this.token);
        this.dataService.getAssesments(this.host, this.token).subscribe(function (assesments) {
            console.log(assesments);
            assesments.forEach(function (assessment) {
                if (assessment.live == "ON") {
                    _this.fetched_assessments.push(assessment);
                    if (!underscore__WEBPACK_IMPORTED_MODULE_3__["has"](_this.assessment_map, assessment.id)) {
                        _this.assessment_map[assessment.id] = assessment;
                    }
                }
            });
            _this.fetched_assessments = underscore__WEBPACK_IMPORTED_MODULE_3__["uniq"](_this.fetched_assessments, 'id');
            _this.fetched_assessments.forEach(function (assessment) {
                _this.assessment_entity_map[assessment.id] = []; //{'entity':[],'assessment_dict':{}};
                _this.assessment_data_map[assessment.id] = {};
                _this.datastreamList.push(assessment.datastream);
            });
            _this.datastreamList = underscore__WEBPACK_IMPORTED_MODULE_3__["uniq"](_this.datastreamList);
            // console.log(this.datastreamList);
        }, function (error) { console.log(error); }, function () {
            _this.datastreamList.forEach(function (datastreamid) {
                if (!_this.assessment_datastream_map[datastreamid]) {
                    _this.dataService.getDatastream(_this.host, _this.token, datastreamid).subscribe(function (datastream) {
                        _this.assessment_datastream_map[datastream.id] = datastream;
                    });
                }
                if (!(underscore__WEBPACK_IMPORTED_MODULE_3__["has"](_this.datastream_entity_meta_map, datastreamid))) {
                    _this.dataService.getEntityMeta(_this.host, _this.token, datastreamid).subscribe(function (entityMeta) {
                        _this.datastream_entity_meta_map[datastreamid] = entityMeta;
                        if (!(underscore__WEBPACK_IMPORTED_MODULE_3__["has"](_this.datastream_entitymeta_label_map, datastreamid))) {
                            _this.datastream_entitymeta_label_map[datastreamid] = {};
                            _this.datastream_entity_meta_map[datastreamid].forEach(function (entityMetaObj) {
                                _this.datastream_entitymeta_label_map[datastreamid][entityMetaObj.sourceId] = entityMetaObj.label;
                            });
                        }
                    });
                }
            });
        });
    };
    UserComponent.prototype.fetch_datastream = function (datastreamid) {
        var _this = this;
        if (datastreamid) {
            this.dataService.getDatastream(this.host, this.token, datastreamid).subscribe(function (datastream) {
                _this.assessment_datastream_map[datastream.id] = datastream;
            }, function (error) {
                console.log(error);
            }, function () { });
        }
    };
    UserComponent.prototype.update_TimeLineChart = function (assessments, timePrecision) {
        var _this = this;
        var precisionFactor = 1;
        if (timePrecision === 'micro') {
            precisionFactor = 1000;
        }
        if (assessments[0] != null) {
            var episodes = [];
            var len = assessments.length - 1;
            this.entity = assessments[0]["entity"];
            console.log("Entity" + this.entity);
            var index = 0;
            while (index <= len) {
                var start_time = parseInt(assessments[index]["time"]);
                start_time = start_time / precisionFactor;
                var value = assessments[index]["value"];
                var i = index;
                var x = assessments[i]["value"];
                var y = assessments[index]["value"];
                while (assessments[i]["value"] === assessments[index]["value"] && i < len) {
                    i = i + 1;
                }
                index = i;
                var end_time = parseInt(assessments[index]["time"]);
                end_time = end_time / precisionFactor;
                //if(start_time==end_time)
                //{
                //end_time=start_time+10000;
                //}
                var tooltip_text = (value + " Start:" + start_time.toString() + " End:" + end_time.toString());
                episodes.push(["Condition", value, this.generate_custom_HTML(value, new Date(start_time), new Date(end_time)), new Date(start_time), new Date(end_time)]);
                if (index == len) {
                    episodes.push(["Condition", assessments[index]["value"], this.generate_custom_HTML(assessments[index]["value"], new Date(end_time), new Date(end_time + 1000)), new Date(end_time), new Date(end_time + 1000)]);
                    index++;
                }
            }
            index = 0;
            var num = this.timeline_chart.wrapper.getDataTable().getNumberOfRows();
            this.timeline_chart.wrapper.getDataTable().removeRows(0, num);
            episodes.forEach(function (element) {
                _this.timeline_chart.wrapper.getDataTable().addRow(element);
            });
        }
    };
    UserComponent.prototype.update_color_list = function (assessments) {
        var _this = this;
        if (assessments) {
            var values = [];
            assessments.forEach(function (element) {
                values.push(element["value"]);
            });
            var set = (Array.from(new Set(values)));
            var conditions = Object.keys(this.colors);
            set.forEach(function (element) {
                if (conditions.includes(element) == false) {
                    var new_color = randomColor();
                    while (Object.values(_this.colors).includes(new_color)) {
                        new_color = randomColor();
                    }
                    _this.colors[element] = new_color;
                }
            });
        }
    };
    UserComponent.prototype.remove = function (array, element) {
        var index = array.indexOf(element);
        array.splice(index, 1);
    };
    UserComponent.prototype.test = function () {
        var _this = this;
        this.http.get("http://127.0.0.1:8000/index/").map(function (res) { return res; }).subscribe(function (r) {
            console.log(r);
            _this.update_ColumnChart(r);
        });
    };
    UserComponent.prototype.update_ColumnChart = function (assessments) {
        var _this = this;
        var colors = this.colors;
        var values = new Array();
        var color_len = colors.length;
        var rand = Math.round(Math.random() * color_len) + 1;
        var len = assessments.length;
        for (var index = 0; index < len; index++) {
            values.push(assessments[index]["value"]);
        }
        var counts = {};
        //set operation on values
        var set = (Array.from(new Set(values)));
        //make initial count of each element zero
        set.forEach(function (element) {
            counts[element] = 0;
        });
        //count frequency of each element
        set.forEach(function (element) {
            values.forEach(function (element2) {
                if (element == element2) {
                    counts[element] = counts[element] + 1;
                }
            });
        });
        //find final percentage
        var num = this.column_chart.wrapper.getDataTable().getNumberOfRows();
        this.column_chart.wrapper.getDataTable().removeRows(0, num);
        set.forEach(function (element) {
            var new_row = [element, (counts[element] / len * 100), colors[element]];
            _this.column_chart.wrapper.getDataTable().addRow(new_row);
        });
    };
    UserComponent.prototype.error_column = function (event) {
        console.log("Error", event.id, event.message, event.options);
    };
    UserComponent.prototype.error_timeline = function (event) {
        console.log("Error", event.id, event.message, event.detailedMessage, event.options);
    };
    UserComponent.prototype.ngOnInit = function () {
    };
    UserComponent.prototype.generate_custom_HTML = function (value, Start, End) {
        return '<table style="width:100%; height: 80%; border:1px solid #ddd;" class="tooltip-active-true">' +
            '<tr style="background-color:beige">' +
            '<td style="border-bottom: 1px solid #ddd;padding:5px">Label</td>' +
            '<td style="border-bottom: 1px solid #ddd;padding:5px">' + value + '</td>' +
            '</tr>' +
            '<tr >' +
            ' <td style="border-bottom: 1px solid #ddd;padding:5px">Start</td>' +
            '<td style="border-bottom: 1px solid #ddd;padding:5px">' + Start + '</td> ' +
            '</tr>' +
            '<tr>' +
            '<td style="padding:5px;">End</td>' +
            '<td style="padding:5px;">' + End + '</td>' +
            '</tr>' +
            ' </table>';
    };
    UserComponent.prototype.goToHome = function () {
        this.http.get("http://127.0.0.1:8000/delete/").subscribe();
        this.router.navigate(['']);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('cchart'),
        __metadata("design:type", Object)
    ], UserComponent.prototype, "timeline_chart", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('ctchart'),
        __metadata("design:type", Object)
    ], UserComponent.prototype, "column_chart", void 0);
    UserComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-user',
            template: __webpack_require__(/*! ./user.component.html */ "./src/app/user/user.component.html"),
            styles: [__webpack_require__(/*! ./user.component.css */ "./src/app/user/user.component.css")]
        }),
        __metadata("design:paramtypes", [_services_data_service__WEBPACK_IMPORTED_MODULE_5__["DataService"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpClient"],
            _angular_router__WEBPACK_IMPORTED_MODULE_6__["Router"],
            ng4_loading_spinner__WEBPACK_IMPORTED_MODULE_7__["Ng4LoadingSpinnerService"]])
    ], UserComponent);
    return UserComponent;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "../../../../node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/ruturaj/Documents/Hackathon/examples/UpdatedApplication/exampleApps/FalkonryDemoExamples/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map
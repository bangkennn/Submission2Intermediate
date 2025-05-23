import AboutView from '../views/AboutView.js';

class AboutPresenter {
    constructor() {
        this._view = new AboutView();
    }

    show() {
        this._view.show();
    }
}

export default AboutPresenter; 
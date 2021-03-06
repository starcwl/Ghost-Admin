import Ember from 'ember';
import LiquidTether from 'liquid-tether/components/liquid-tether';
import {invokeAction} from 'ember-invoke-action';

const {
    RSVP: {Promise},
    inject: {service},
    A: emberA,
    isBlank,
    on,
    run
} = Ember;

const FullScreenModalComponent = LiquidTether.extend({
    to: 'fullscreen-modal',
    target: 'document.body',
    targetModifier: 'visible',
    targetAttachment: 'top center',
    attachment: 'top center',
    tetherClass: 'fullscreen-modal',
    overlayClass: 'fullscreen-modal-background',
    modalPath: 'unknown',

    dropdown: service(),

    init() {
        this._super(...arguments);
        this.modalPath = `modals/${this.get('modal')}`;
    },

    setTetherClass: on('init', function () {
        let tetherClass = this.get('tetherClass');
        let modifiers = (this.get('modifier') || '').split(' ');
        let tetherClasses = emberA([tetherClass]);

        modifiers.forEach((modifier) => {
            if (!isBlank(modifier)) {
                let className = `${tetherClass}-${modifier}`;
                tetherClasses.push(className);
            }
        });

        this.set('tetherClass', tetherClasses.join(' '));
    }),

    closeDropdowns: on('didInsertElement', function () {
        run.schedule('afterRender', this, function () {
            this.get('dropdown').closeDropdowns();
        });
    }),

    actions: {
        close() {
            // Because we return the promise from invokeAction, we have
            // to check if "close" exists first
            if (this.get('close')) {
                return invokeAction(this, 'close');
            }

            return new Promise((resolve) => {
                resolve();
            });
        },

        confirm() {
            if (this.get('confirm')) {
                return invokeAction(this, 'confirm');
            }

            return new Promise((resolve) => {
                resolve();
            });
        },

        clickOverlay() {
            this.send('close');
        }
    }
});

FullScreenModalComponent.reopenClass({
    positionalParams: ['modal']
});

export default FullScreenModalComponent;

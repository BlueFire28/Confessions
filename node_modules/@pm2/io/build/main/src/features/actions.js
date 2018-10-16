"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const domain = require("domain");
const debug_1 = require("debug");
const debug = debug_1.default('axm:actions');
const serviceManager_1 = require("../serviceManager");
const transport_1 = require("../utils/transport");
const actions_1 = require("../services/actions");
class ActionsFeature {
    constructor(autoExit) {
        serviceManager_1.ServiceManager.set('actionsService', new actions_1.default(this));
        this.actionsService = serviceManager_1.ServiceManager.get('actionsService');
        process.on('message', this.listener);
        if (autoExit) {
            // clean listener if event loop is empty
            // important to ensure apm will not prevent application to stop
            this.timer = setInterval(() => {
                const dump = serviceManager_1.ServiceManager.get('eventLoopService').inspector.dump();
                if (!dump || (dump.setImmediates.length === 0 &&
                    dump.nextTicks.length === 0 &&
                    (Object.keys(dump.handles).length === 0 || (Object.keys(dump.handles).length === 1 &&
                        dump.handles.hasOwnProperty('Socket') &&
                        dump.handles.Socket.length === 2 &&
                        dump.handles.Socket[0].fd === 1 &&
                        dump.handles.Socket[1].fd === 2)) &&
                    Object.keys(dump.requests).length === 0)) {
                    process.removeListener('message', this.listener);
                }
            }, 1000);
            this.timer.unref();
        }
    }
    listener(data) {
        if (!data)
            return false;
        const actionName = data.msg ? data.msg : data.action_name ? data.action_name : data;
        let actionData = serviceManager_1.ServiceManager.get('actions').get(actionName);
        let fn = actionData ? actionData.fn : null;
        const reply = actionData ? actionData.reply : null;
        if (actionData) {
            // In case 2 arguments has been set but no options has been transmitted
            if (fn.length === 2 && typeof (data) === 'string' && data === actionName) {
                return fn({}, reply);
            }
            // In case 1 arguments has been set but options has been transmitted
            if (fn.length === 1 && typeof (data) === 'object' && data.msg === actionName) {
                return fn(reply);
            }
            /**
             * Classical call
             */
            if (typeof (data) === 'string' && data === actionName) {
                return fn(reply);
            }
            /**
             * If data is an object == v2 protocol
             * Pass the opts as first argument
             */
            if (typeof (data) === 'object' && data.msg === actionName) {
                return fn(data.opts, reply);
            }
        }
        // -----------------------------------------------------------
        //                      Scoped actions
        // -----------------------------------------------------------
        if (data.uuid === undefined || data.action_name === undefined) {
            return false;
        }
        actionData = serviceManager_1.ServiceManager.get('actionsScoped').get(actionName);
        if (data.action_name === actionName) {
            const res = {
                send: (dt) => {
                    transport_1.default.send({
                        type: 'axm:scoped_action:stream',
                        data: {
                            data: dt,
                            uuid: data.uuid,
                            action_name: actionName
                        }
                    });
                },
                error: (dt) => {
                    transport_1.default.send({
                        type: 'axm:scoped_action:error',
                        data: {
                            data: dt,
                            uuid: data.uuid,
                            action_name: actionName
                        }
                    });
                },
                end: (dt) => {
                    transport_1.default.send({
                        type: 'axm:scoped_action:end',
                        data: {
                            data: dt,
                            uuid: data.uuid,
                            action_name: actionName
                        }
                    });
                }
            };
            const d = domain.create();
            d.on('error', function (err) {
                res.error(err.message || err.stack || err);
                setTimeout(function () {
                    process.exit(1);
                }, 300);
            });
            d.run(function () {
                actionData.fn(data.opts || null, res);
            });
        }
    }
    init(conf, force) {
        this.actionsService.init(conf, force);
        return {
            action: this.action
        };
    }
    destroy() {
        this.actionsService.destroy();
        serviceManager_1.ServiceManager.reset('actions');
        serviceManager_1.ServiceManager.reset('actionsScoped');
        process.removeListener('message', this.listener);
        clearInterval(this.timer);
    }
    action(actionName, opts, fn) {
        if (!fn) {
            fn = opts;
            opts = null;
        }
        const check = this.check(actionName, fn);
        if (!check) {
            return check;
        }
        let type = 'custom';
        if (actionName.indexOf('km:') === 0 || actionName.indexOf('internal:') === 0) {
            type = 'internal';
        }
        // Notify the action
        transport_1.default.send({
            type: 'axm:action',
            data: {
                action_name: actionName,
                action_type: type,
                opts: opts,
                arity: fn.length
            }
        });
        const reply = (data) => {
            transport_1.default.send({
                type: 'axm:reply',
                data: {
                    return: data,
                    action_name: actionName
                }
            });
        };
        serviceManager_1.ServiceManager.get('actions').set(actionName, { fn: fn, reply: reply });
    }
    scopedAction(actionName, fn) {
        const check = this.check(actionName, fn);
        if (!check) {
            return check;
        }
        // Notify the action
        transport_1.default.send({
            type: 'axm:action',
            data: {
                action_name: actionName,
                action_type: 'scoped'
            }
        });
        serviceManager_1.ServiceManager.get('actionsScoped').set(actionName, { fn: fn });
    }
    check(actionName, fn) {
        if (!actionName) {
            console.error('[PMX] action.action_name is missing');
            return false;
        }
        if (!fn) {
            console.error('[PMX] callback is missing');
            return false;
        }
        if (!process.send) {
            debug('Process not running within PM2');
            return false;
        }
        return true;
    }
}
exports.default = ActionsFeature;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9mZWF0dXJlcy9hY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQWdDO0FBQ2hDLGlDQUF5QjtBQUN6QixNQUFNLEtBQUssR0FBRyxlQUFLLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDbEMsc0RBQWtEO0FBQ2xELGtEQUEwQztBQUUxQyxpREFBZ0Q7QUFFaEQ7SUFLRSxZQUFhLFFBQWtCO1FBQzdCLCtCQUFjLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLElBQUksaUJBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBQzlELElBQUksQ0FBQyxjQUFjLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtRQUMxRCxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7UUFFcEMsSUFBSSxRQUFRLEVBQUU7WUFDWix3Q0FBd0M7WUFDeEMsK0RBQStEO1lBQy9ELElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRTtnQkFDNUIsTUFBTSxJQUFJLEdBQUcsK0JBQWMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUE7Z0JBRXBFLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sS0FBSyxDQUFDO29CQUN6QyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDO29CQUMzQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQzt3QkFDaEYsSUFBSSxDQUFD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
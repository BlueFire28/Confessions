"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const async_1 = require("async");
const json_1 = require("../utils/json");
const serviceManager_1 = require("../serviceManager");
const transport_1 = require("../utils/transport");
class NotifyInspector {
    static catchAllDebugger() {
        const exceptionsTrapped = [];
        const session = serviceManager_1.ServiceManager.get('inspector').createSession();
        serviceManager_1.ServiceManager.get('inspector').connect();
        // trap exception so we can re-use them with the debugger
        const trapException = listener => {
            return (error) => {
                // log it
                if (listener === 'unhandledRejection') {
                    console.log('You have triggered an unhandledRejection, you may have forgotten to catch a Promise rejection:');
                }
                console.error(error);
                // create object to be send
                const context = exceptionsTrapped.find((exception) => {
                    return !!exception.error.description.match(error.message);
                });
                error = json_1.default.jsonize(error);
                error.context = context ? context.scopes : undefined;
                // send it
                transport_1.default.send({
                    type: 'process:exception',
                    data: error
                });
                // at this point the process should exit
                process.exit(1);
            };
        };
        process.on('uncaughtException', trapException('uncaughtException'));
        process.on('unhandledRejection', trapException('unhandledRejection'));
        session.post('Debugger.enable');
        session.post('Debugger.setPauseOnExceptions', { state: 'uncaught' });
        session.on('Debugger.paused', ({ params }) => {
            // should not happen but anyway
            if (params.reason !== 'exception' && params.reason !== 'promiseRejection') {
                return session.post('Debugger.resume');
            }
            if (!params.data)
                return session.post('Debugger.resume');
            const error = params.data;
            // only the current frame is interesting us
            const frame = params.callFrames[0];
            // inspect each scope to retrieve his context
            async_1.default.map(frame.scopeChain, (scope, next) => {
                if (scope.type === 'global')
                    return next();
                // get context of the scope
                session.post('Runtime.getProperties', {
                    objectId: scope.object.objectId,
                    ownProperties: true
                }, (err, data) => {
                    const result = data.result;
                    return next(err, {
                        scope: scope.type,
                        name: scope.name,
                        startLocation: scope.startLocation,
                        endLocation: scope.endLocation,
                        context: result.map((entry) => {
                            if (!entry.value)
                                return {};
                            return {
                                name: entry.name,
                                type: entry.value.type,
                                value: entry.value.value ? entry.value.value : entry.value.description
                            };
                        })
                    });
                });
            }, (err, scopes) => {
                if (err)
                    return console.error(err);
                // we can remove some scope so we want to remove null entry
                scopes = scopes.filter(scope => !!scope);
                // okay so we want to get all of the script to attach it to the error
                const scriptIds = scopes.map((scope) => {
                    return scope.startLocation ? scope.startLocation.scriptId : null;
                }).filter(scriptId => !!scriptId);
                async_1.default.map(scriptIds, (scriptId, next) => {
                    session.post('Debugger.getScriptSource', {
                        scriptId
                    }, (err, data) => {
                        return next(err, { id: scriptId, source: data.scriptSource });
                    });
                }, (err, scripts) => {
                    if (err)
                        return console.error(err);
                    // so now we want only to attach the script source that match each scope
                    async_1.default.map(scopes, (scope, next) => {
                        if (!scope.startLocation || !scope.endLocation)
                            return next();
                        // get the script for this scope
                        let script = scripts.find(script => {
                            if (!scope.startLocation)
                                return false;
                            return script.id === scope.startLocation.scriptId;
                        });
                        script = script.source.split('\n');
                        // dont attach the whole script of the closure of the file
                        if (scope.startLocation.lineNumber === 0 && scope.endLocation.lineNumber + 1 === script.length) {
                            return next(null, { scope });
                        }
                        // remove the part before the scope
                        script.splice(0, scope.startLocation.lineNumber);
                        // remove the part after the scope
                        script.splice(scope.endLocation.lineNumber + 1, script.length - 1);
                        // then we can attach the source to the scope
                        return next(null, {
                            source: script,
                            scope
                        });
                    }, (err, scopes) => {
                        if (err)
                            return console.error(err);
                        exceptionsTrapped.push({ error, scopes });
                        // continue execution
                        return session.post('Debugger.resume');
                    });
                });
            });
        });
    }
}
exports.default = NotifyInspector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZ5SW5zcGVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2ZlYXR1cmVzL25vdGlmeUluc3BlY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUF5QjtBQUV6Qix3Q0FBcUM7QUFDckMsc0RBQWtEO0FBQ2xELGtEQUEwQztBQVcxQztJQUVFLE1BQU0sQ0FBQyxnQkFBZ0I7UUFNckIsTUFBTSxpQkFBaUIsR0FBdUIsRUFBRSxDQUFBO1FBQ2hELE1BQU0sT0FBTyxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQy9ELCtCQUFjLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBO1FBRXpDLHlEQUF5RDtRQUN6RCxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsRUFBRTtZQUMvQixPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQ2YsU0FBUztnQkFDVCxJQUFJLFFBQVEsS0FBSyxvQkFBb0IsRUFBRTtvQkFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnR0FBZ0csQ0FBQyxDQUFBO2lCQUM5RztnQkFDRCxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUNwQiwyQkFBMkI7Z0JBQzNCLE1BQU0sT0FBTyxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLFNBQTJCLEVBQUUsRUFBRTtvQkFDckUsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtnQkFDM0QsQ0FBQyxDQUFDLENBQUE7Z0JBQ0YsS0FBSyxHQUFHLGNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBQ2hDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxD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
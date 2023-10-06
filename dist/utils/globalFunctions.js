"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToReadableTime = void 0;
function convertToReadableTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - hours * 3600) / 60);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}
exports.convertToReadableTime = convertToReadableTime;

import { BadRequestException } from "@nestjs/common";
import { extname } from "path";

export function excelFileFilter(_, file, callback) {
    if (!file.originalname.match(/\.(xls|xlsx)$/)) {
        return callback(new BadRequestException('Only excel files are allowed!'), false);
    }
    callback(null, true);
}

export function editFileName(_, file, callback) {
    const fileExtName = extname(file.originalname);
    const randomName = getRandomCode();
    callback(null, `${randomName}${fileExtName}`);
};


export function getRandomCode() {
    return new Date().getTime() + "_" + Array(8)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
};
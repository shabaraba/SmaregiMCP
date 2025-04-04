import {exec} from 'child_process';

// POS API定義の読み込み
exec('rm -f ../src/schema/converted/pos.json');
exec('npm run convert:pos');
const posDefinition = await import("../src/schema/converted/pos.json");
console.log(posDefinition.properties);

// COMMON API定義の読み込み
exec('rm -f ../src/schema/converted/pos.json');
exec('npm run convert:common');
const commonDefinition = await import("../src/schema/converted/common.json");
console.log(commonDefinition.properties);


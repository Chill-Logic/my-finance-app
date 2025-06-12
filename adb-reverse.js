require('dotenv').config();
const { execSync } = require('child_process');

const deviceId = process.env.DEVICE_ID;

if (!deviceId) {
	console.error('❌ DEVICE_ID não definido no .env');
	process.exit(1);
}

try {
	execSync(`adb -s ${ deviceId } reverse tcp:8081 tcp:8081`, { stdio: 'inherit' });
	console.log(`✅ Porta 8081 redirecionada com sucesso para o dispositivo ${ deviceId }`);
} catch (err) {
	console.error('❌ Erro ao executar o comando adb:', err.message);
	process.exit(1);
}

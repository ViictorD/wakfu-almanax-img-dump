import axios from "axios"
import moment from "moment"
import fs from "fs"

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const main = async () => {

	const year = 2024; // We set 2024 so we get february 29th
	const startOfYear = moment(`${year}-05-09`)
	const endOfYear = moment(`${year}-12-31`)

	let currentDate = startOfYear.clone()


	if (!fs.existsSync('./output')) {
		fs.mkdirSync('./output');
	}

	if (!fs.existsSync('./output/boss')) {
		fs.mkdirSync('./output/boss');
	}

	if (!fs.existsSync('./output/zodiac')) {
		fs.mkdirSync('./output/zodiac');
	}

	if (!fs.existsSync('./output/month')) {
		fs.mkdirSync('./output/month');
	}

	
	
	
	while (currentDate.isSameOrBefore(endOfYear)) {
		console.log(`Fetching data for ${currentDate.format("YYYY-MM-DD")}...`);
		const uri = `https://haapi.ankama.com/json/Ankama/v2/Almanax/GetEvent?lang=fr&date=${currentDate.format("YYYY-MM-DD")}`;
		// console.log(uri);
		const response = (await axios.get(uri)).data;

		// boss
		let boss_path = `./output/boss/${response.event.id}.png`;
		if (!fs.existsSync(boss_path) && typeof response.event.boss_image_url === "string" ) {
			await sleep(1000) // Wait 1 sec to chill on the API
			const boss = await axios.get(response.event.boss_image_url, { responseType: 'arraybuffer' })
			if (boss.status != 200) {
				console.log(`Error fetching boss ${response.event.id} for ${currentDate.format("YYYY-MM-DD")}`)
			}
			else {
				fs.writeFileSync(boss_path, Buffer.from(boss.data, 'binary'))
			}
		}

		// zodiac
		let zodiac_path = `./output/zodiac/${response.zodiac.id}.png`;
		if (!fs.existsSync(zodiac_path)) {
			await sleep(1000) // Wait 1 sec to chill on the API
			const zodiac = await axios.get(response.zodiac.image_url, { responseType: 'arraybuffer' })
			if (zodiac.status != 200) {
				console.log(`Error fetching zodiac ${response.zodiac.id} for ${currentDate.format("YYYY-MM-DD")}`)
			}
			else {
				fs.writeFileSync(zodiac_path, Buffer.from(zodiac.data, 'binary'))
			}
		}

		// month
		let month_path = `./output/month/${response.month.id}.png`;
		if (!fs.existsSync(month_path)) {
			await sleep(1000) // Wait 1 sec to chill on the API
			const month = await axios.get(response.month.protector_image_url, { responseType: 'arraybuffer' })
			if (month.status != 200) {
				console.log(`Error fetching month ${response.month.id} for ${currentDate.format("YYYY-MM-DD")}`)
			}
			else {
				fs.writeFileSync(month_path, Buffer.from(month.data, 'binary'))
			}
		}
		
		currentDate.add(1, "days")
		await sleep(1000) // Wait 1 sec to chill on the API
	}

}

main()
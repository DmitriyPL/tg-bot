import dotenv from "dotenv";
dotenv.config();

import  TelegramBot from "node-telegram-bot-api";
import express from "express";
import cors from "cors";


const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
const token = TG_BOT_TOKEN;
const webAppUrl = "https://willowy-beijinho-38a002.netlify.app";

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.onText(/\/start/, async (msg) => {

    await bot.sendMessage(msg.chat.id, "Ниже появится кнопка, заполните форму", {
        reply_markup: {
            keyboard: [
                [
                    {text: "Заполнить форму", web_app: {url: webAppUrl + '/form'} }
                ]]
        }
    });

    await bot.sendMessage(msg.chat.id, "Заходи в интернет магазин по кнопке ниже", {
        reply_markup: {
            inline_keyboard: [
                [
                    {text: "Интернет магазин", web_app: {url: webAppUrl} }
                ]]
        }
    });

});

bot.on('message', async (msg) => {

    const chatId = msg.chat.id;

    if( msg?.web_app_data?.data ) {
        try {
            const data = JSON.parse( msg?.web_app_data?.data )

            await bot.sendMessage(chatId, 'Спасибо за заказ!' );
            await bot.sendMessage(chatId, 'Ваш город:' + data?.town );
            await bot.sendMessage(chatId, 'Ваша улица:' + data?.street );

            setTimeout( async () => {
                await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате');
            }, 3000)

        } catch (e) {
            console.log(e);
        }
    }

});

app.post('/web-data', async (req, res) => {
    const {queryId, products, totalPrice} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {
                message_text: `Поздравляем с успешной покупкой,
                вы приобрели товаров на сумму ${totalPrice}`
            }
        })

        return res.status(200).json({});

    } catch (e) {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Не удалось приобрести товар',
            input_message_content: {
                message_text: `Не удалось приобрести товар`
            }
        })

        return res.status(500).json({});

    }
})

const PORT = 8000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));






























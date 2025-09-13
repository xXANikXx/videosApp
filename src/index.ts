import express from "express";
import { setupApp } from "./setupApp";

const app = express();
setupApp(app);

// экспортируем для Vercel
export default app;

// если нужно локально тестировать:
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`);
    });
}

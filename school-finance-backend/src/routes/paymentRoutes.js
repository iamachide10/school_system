import express from 'express'
import { createPaymentController,fetchPayments } from "../controllers/paymentController.js"


const router = express.Router()


router.post("/pay_fees", createPaymentController);
router.get("/:student_id/payments", fetchPayments);

export default router
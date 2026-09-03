const express = require("express");
const {
    addIncome,
    getAllIncone,
    deleteIncome,
    downloadIncomeExcel
} =  require("../controllers/incomeController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addIncome);
router.get("/get", protect, getAllIncone);
router.delete("/:id", protect, deleteIncome);
router.get("/downloadexcel", protect, downloadIncomeExcel);

module.exports = router;
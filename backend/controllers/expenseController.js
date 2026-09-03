const xlsx = require("xlsx");
const Expense = require("../models/Expense");

// Add Expense
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body || {};

        // Validation Check for missing fields
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });

        await newExpense.save();
        res.status(201).json({ message: "Expense added successfully", expense: newExpense });
    } catch (error) {
        res.status(500).json({ message: "Error adding expense", error });
    }
}
 
// Get All Expenses
exports.getAllExpenses = async (req, res) => {
    const userId = req.user.id;

    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching income", error });
    }
}

// Delete Expense Source
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting expense", error });
    }
}

// Download Expense Data as Excel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({userId}).sort({ date: -1 });

        //  Prepare date for Excel
        const date = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(date);
        xlsx.utils.book_append_sheet(wb, ws, "Expenses");
        xlsx.writeFile(wb, "expense_details.xlsx");
        res.download("expense_details.xlsx");
    } catch (error) {
        res.status(500).json({ message: "Error downloading expense data", error });
    }
}
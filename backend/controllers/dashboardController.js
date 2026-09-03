const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { isValidObjectId, Types } = require("mongoose");

// Dashboard Data
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;

        // Validate user ID
        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                message: "Invalid user ID",
            });
        }

        // Convert string ID to MongoDB ObjectId
        const userObjectId = new Types.ObjectId(userId);

        // Fetch total income
        const totalIncome = await Income.aggregate([
            {
                $match: {
                    userId: userObjectId,
                },
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$amount",
                    },
                },
            },
        ]);

        console.log("Total Income:", {
            totalIncome,
            userId,
        });

        // Fetch total expense
        const totalExpense = await Expense.aggregate([
            {
                $match: {
                    userId: userObjectId,
                },
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$amount",
                    },
                },
            },
        ]);

        // Get income transactions in the last 60 days
        const last60DaysIncomeTransactions = await Income.find({
            userId: userObjectId,
            date: {
                $gte: new Date(
                    Date.now() - 60 * 24 * 60 * 60 * 1000
                ),
            },
        }).sort({ date: -1 });

        // Get total income for last 60 days
        const incomeLast60Days =
            last60DaysIncomeTransactions.reduce(
                (sum, transaction) => sum + transaction.amount,
                0
            );

        // Get expense transactions in the last 30 days
        const last30DaysExpenseTransactions = await Expense.find({
            userId: userObjectId,
            date: {
                $gte: new Date(
                    Date.now() - 30 * 24 * 60 * 60 * 1000
                ),
            },
        }).sort({ date: -1 });

        // Get total expense for last 30 days
        const expenseLast30Days =
            last30DaysExpenseTransactions.reduce(
                (sum, transaction) => sum + transaction.amount,
                0
            );

        // Fetch last 5 income transactions
        const incomeTransactions = await Income.find({
            userId: userObjectId,
        })
            .sort({ date: -1 })
            .limit(5);

        // Fetch last 5 expense transactions
        const expenseTransactions = await Expense.find({
            userId: userObjectId,
        })
            .sort({ date: -1 })
            .limit(5);

        // Combine transactions
        const lastTransactions = [
            ...incomeTransactions.map((txn) => ({
                ...txn.toObject(),
                type: "income",
            })),

            ...expenseTransactions.map((txn) => ({
                ...txn.toObject(),
                type: "expense",
            })),
        ]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        // Final response
        res.json({
            totalBalance:
                (totalIncome[0]?.total || 0) -
                (totalExpense[0]?.total || 0),

            totalIncome: totalIncome[0]?.total || 0,

            totalExpense: totalExpense[0]?.total || 0,

            Last30DaysExpenses: {
                total: expenseLast30Days,
                transactions: last30DaysExpenseTransactions,
            },

            Last60DaysIncome: {
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransactions,
            },

            recentTransactions: lastTransactions,
        });
    } catch (error) {
        console.error("Dashboard Error:", error);

        res.status(500).json({
            message: "Error fetching dashboard data",
            error: error.message,
        });
    }
};
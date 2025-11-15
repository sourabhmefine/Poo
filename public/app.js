// Trading Platform Application
class TradingPlatform {
    constructor() {
        // Initialize state
        this.balance = 10000.00;
        this.holdings = {};
        this.transactions = [];
        this.prices = {
            AAPL: 150.00,
            GOOGL: 2800.00,
            MSFT: 330.00,
            AMZN: 3300.00,
            TSLA: 250.00
        };
        this.selectedSymbol = 'AAPL';

        // Initialize app
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updatePriceTicker();
        this.updateUI();
        this.startPriceUpdates();
    }

    setupEventListeners() {
        // Symbol selection
        const symbolSelect = document.getElementById('symbol');
        symbolSelect.addEventListener('change', (e) => {
            this.selectedSymbol = e.target.value;
            this.updateTradeForm();
        });

        // Quantity change
        const quantityInput = document.getElementById('quantity');
        quantityInput.addEventListener('input', () => {
            this.updateTradeForm();
        });

        // Trade form submission
        const tradeForm = document.getElementById('trade-form');
        tradeForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });

        // Buy/Sell buttons
        document.querySelector('.btn-buy').addEventListener('click', (e) => {
            e.preventDefault();
            this.executeTrade('buy');
        });

        document.querySelector('.btn-sell').addEventListener('click', (e) => {
            e.preventDefault();
            this.executeTrade('sell');
        });
    }

    updatePriceTicker() {
        const ticker = document.getElementById('price-ticker');
        ticker.innerHTML = '';

        Object.keys(this.prices).forEach(symbol => {
            const card = document.createElement('div');
            card.className = 'price-card';
            if (symbol === this.selectedSymbol) {
                card.classList.add('selected');
            }

            const change = (Math.random() * 4 - 2).toFixed(2); // Random change for demo
            const changeClass = change >= 0 ? 'positive' : 'negative';
            const changeSymbol = change >= 0 ? '▲' : '▼';

            card.innerHTML = `
                <div class="symbol">${symbol}</div>
                <div class="price">$${this.prices[symbol].toFixed(2)}</div>
                <div class="change ${changeClass}">${changeSymbol} ${Math.abs(change)}%</div>
            `;

            card.addEventListener('click', () => {
                this.selectedSymbol = symbol;
                document.getElementById('symbol').value = symbol;
                this.updatePriceTicker();
                this.updateTradeForm();
            });

            ticker.appendChild(card);
        });
    }

    updateTradeForm() {
        const quantity = parseInt(document.getElementById('quantity').value) || 0;
        const currentPrice = this.prices[this.selectedSymbol];
        const totalCost = currentPrice * quantity;

        document.getElementById('current-price').textContent = currentPrice.toFixed(2);
        document.getElementById('total-cost').textContent = totalCost.toFixed(2);
    }

    executeTrade(type) {
        const symbol = this.selectedSymbol;
        const quantity = parseInt(document.getElementById('quantity').value);
        const price = this.prices[symbol];
        const total = price * quantity;

        if (type === 'buy') {
            if (total > this.balance) {
                alert('Insufficient balance!');
                return;
            }

            this.balance -= total;

            if (!this.holdings[symbol]) {
                this.holdings[symbol] = {
                    quantity: 0,
                    avgPrice: 0,
                    totalCost: 0
                };
            }

            const holding = this.holdings[symbol];
            holding.totalCost += total;
            holding.quantity += quantity;
            holding.avgPrice = holding.totalCost / holding.quantity;

        } else if (type === 'sell') {
            if (!this.holdings[symbol] || this.holdings[symbol].quantity < quantity) {
                alert('Insufficient holdings!');
                return;
            }

            this.balance += total;

            const holding = this.holdings[symbol];
            holding.quantity -= quantity;
            holding.totalCost -= holding.avgPrice * quantity;

            if (holding.quantity === 0) {
                delete this.holdings[symbol];
            }
        }

        // Record transaction
        this.transactions.unshift({
            time: new Date(),
            type: type,
            symbol: symbol,
            quantity: quantity,
            price: price,
            total: total
        });

        // Keep only last 20 transactions
        if (this.transactions.length > 20) {
            this.transactions = this.transactions.slice(0, 20);
        }

        // Update UI
        this.updateUI();

        // Show feedback
        this.showNotification(`${type.toUpperCase()}: ${quantity} ${symbol} @ $${price.toFixed(2)}`);
    }

    updateUI() {
        // Update balance
        document.getElementById('balance').textContent = this.balance.toFixed(2);

        // Update portfolio stats
        let totalValue = this.balance;
        let totalPL = 0;
        let holdingsCount = 0;

        Object.keys(this.holdings).forEach(symbol => {
            const holding = this.holdings[symbol];
            const currentValue = holding.quantity * this.prices[symbol];
            totalValue += currentValue;
            totalPL += currentValue - holding.totalCost;
            holdingsCount++;
        });

        document.getElementById('total-value').textContent = totalValue.toFixed(2);
        document.getElementById('holdings-count').textContent = holdingsCount;

        const plElement = document.getElementById('total-pl');
        plElement.textContent = `$${totalPL.toFixed(2)}`;
        plElement.className = 'stat-value ' + (totalPL >= 0 ? 'positive' : 'negative');

        // Update holdings table
        this.updateHoldingsTable();

        // Update transaction history
        this.updateTransactionHistory();

        // Update trade form
        this.updateTradeForm();
    }

    updateHoldingsTable() {
        const tbody = document.getElementById('holdings-body');
        tbody.innerHTML = '';

        if (Object.keys(this.holdings).length === 0) {
            tbody.innerHTML = '<tr class="no-data"><td colspan="6">No holdings yet. Start trading!</td></tr>';
            return;
        }

        Object.keys(this.holdings).forEach(symbol => {
            const holding = this.holdings[symbol];
            const currentPrice = this.prices[symbol];
            const currentValue = holding.quantity * currentPrice;
            const pl = currentValue - holding.totalCost;
            const plPercent = (pl / holding.totalCost) * 100;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${symbol}</strong></td>
                <td>${holding.quantity}</td>
                <td>$${holding.avgPrice.toFixed(2)}</td>
                <td>$${currentPrice.toFixed(2)}</td>
                <td class="${pl >= 0 ? 'positive' : 'negative'}">$${pl.toFixed(2)}</td>
                <td class="${plPercent >= 0 ? 'positive' : 'negative'}">${plPercent.toFixed(2)}%</td>
            `;
            tbody.appendChild(row);
        });
    }

    updateTransactionHistory() {
        const tbody = document.getElementById('history-body');
        tbody.innerHTML = '';

        if (this.transactions.length === 0) {
            tbody.innerHTML = '<tr class="no-data"><td colspan="6">No transactions yet</td></tr>';
            return;
        }

        this.transactions.forEach(tx => {
            const row = document.createElement('tr');
            const time = tx.time.toLocaleTimeString();

            row.innerHTML = `
                <td>${time}</td>
                <td><span class="trade-type ${tx.type}">${tx.type}</span></td>
                <td><strong>${tx.symbol}</strong></td>
                <td>${tx.quantity}</td>
                <td>$${tx.price.toFixed(2)}</td>
                <td>$${tx.total.toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });
    }

    startPriceUpdates() {
        // Simulate live price updates
        setInterval(() => {
            Object.keys(this.prices).forEach(symbol => {
                // Random price movement (-2% to +2%)
                const change = (Math.random() - 0.5) * 0.04;
                this.prices[symbol] *= (1 + change);

                // Keep prices within reasonable bounds
                this.prices[symbol] = Math.max(this.prices[symbol], 10);
            });

            this.updatePriceTicker();
            this.updateTradeForm();

            // Update holdings if any exist
            if (Object.keys(this.holdings).length > 0) {
                this.updateUI();
            }
        }, 3000); // Update every 3 seconds
    }

    showNotification(message) {
        // Simple notification - could be enhanced with a toast library
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the trading platform when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TradingPlatform();
});

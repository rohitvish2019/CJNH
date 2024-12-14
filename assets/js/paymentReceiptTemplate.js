function convertToWords() {
    const amount = document.getElementById('amount').value;
    const result = document.getElementById('result');
    result.textContent = test(amount);
}

function test(n) {
    if (n < 0)
        return false;

    // Arrays to hold words for single-digit, double-digit, and below-hundred numbers
    single_digit = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
    double_digit = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
        'Eighteen', 'Nineteen'
    ]
    below_hundred = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

    if (n === 0) return 'Zero';

    // Recursive function to translate the number into words
    function translate(n) {
        let word = "";
        if (n < 10) {
            word = single_digit[n] + ' ';
        } else if (n < 20) {
            word = double_digit[n - 10] + ' ';
        } else if (n < 100) {
            let rem = translate(n % 10);
            word = below_hundred[(n - n % 10) / 10 - 2] + ' ' + rem;
        } else if (n < 1000) {
            word = single_digit[Math.trunc(n / 100)] + ' Hundred ' + translate(n % 100);
        } else if (n < 1000000) {
            word = translate(parseInt(n / 1000)).trim() + ' Thousand ' + translate(n % 1000);
        } else if (n < 1000000000) {
            word = translate(parseInt(n / 1000000)).trim() + ' Million ' + translate(n % 1000000);
        } else {
            word = translate(parseInt(n / 1000000000)).trim() + ' Billion ' + translate(n % 1000000000);
        }
        return word;
    }

    // Get the result by translating the given number
    let result = translate(n);
    return result.trim();
}

function updaters()
{
    const amount = document.getElementById('amount').value;   
    document.getElementById('rs').textContent = amount
}

function printMe() {
    document.getElementById('printButton').style.display = 'none'
    window.print()
}

convertToWords()
updaters()
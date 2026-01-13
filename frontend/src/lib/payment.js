export const DUMMY_CARDS = [
    "4242424242424242", // Stripe Test Card
    "1234567890123456", // Simple Sequence
    "5555555555555555", // All Fives
    "4012888888881881", // Visa
];

export function luhnCheck(cardNumber) {
    if (!cardNumber) return false;

    // Remove all non-digit characters
    const digits = cardNumber.replace(/\D/g, "");

    if (digits.length === 0) return false;

    let sum = 0;
    let isSecond = false;

    // Loop from right to left
    for (let i = digits.length - 1; i >= 0; i--) {
        let d = parseInt(digits[i]);

        if (isSecond) {
            d = d * 2;
            if (d > 9) {
                d -= 9; // equivalent to adding digits of the product (e.g. 18 -> 9, 10 -> 1)
            }
        }

        sum += d;
        isSecond = !isSecond;
    }

    return sum % 10 === 0;
}

export function validatePaymentCard(number) {
    const cleanNumber = number.replace(/\D/g, "");

    // 1. Check if it's in the whitelist
    if (!DUMMY_CARDS.includes(cleanNumber)) {
        return { valid: false, error: "This card is not supported. Please use a demo card." };
    }

    // 2. Perform Luhn check (Technically redundant if we only allow specific cards, but good for realism/completeness)
    if (!luhnCheck(cleanNumber)) {
        return { valid: false, error: "Invalid card number checksum." };
    }

    return { valid: true };
}

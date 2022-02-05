const isValidFileName = (input) => {
    if (input.includes('/') || input.includes('\\') || input.includes('<') || input.includes('>') ||
        input.includes('|') || input.includes('?') || input.includes('*') || input.includes('"')) {
            return false;
    }

    return true;


}

module.exports = isValidFileName;
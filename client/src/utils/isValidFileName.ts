const isValidFileName = (input: string) => {
    if (input.includes('/') || input.includes('\\') || input.includes('<') || input.includes('>') ||
        input.includes('|') || input.includes('?') || input.includes('*') || input.includes('"')) {
            return false;
    }

    return true;


}

export default isValidFileName;
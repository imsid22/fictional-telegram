def isPalindrome(inputString):
    """
    This function determines if a string is a palindrome or not.
    a string is considered a palindrome when the sequence of letters in a string
    is the same as the sequence when the string is reversed
    :param inputString: the string which is to be determined as a palindrome or not
    :return: Boolean value of True (if the string is a palindrome) or False (if the string is not a palindrome)
    """
    if inputString == reverseString(inputString):
        return True
    else:
        return False


def reverseString(inputString):
    """
    This function takes in a string and reverses the sequence of the letters in the string
    e.g if the input string is Digi, the string returned will be igiD
    :param inputString: a String to be reversed
    :return: String with the sequence of characters reversed
    """
    reverse = ""
    for char in inputString:
        reverse = char + reverse
    return reverse

if __name__ == "__main__":
    inputString = "beanbag"
    print(isPalindrome(inputString))
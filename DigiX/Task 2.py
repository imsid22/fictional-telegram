def findHCF(num, arr):
    """
    This function finds the highest common factor of a particular set of numbers
    the HCF of a set of numbers is the largest number which can divide all the numbers
    in the defined set
    :param num: the number of positive numbers in the array
    :param arr: the array containing the numbers to find their HCF
    :return: the HCF of the set of numbers sent in the array
    """
    counter = max(arr)

    while counter >= 0:
        check = 1
        startIteration = len(arr)-num
        for item in arr[startIteration:]:
            if item % counter != 0:
                check = 0
                break
        if check == 1:
            break

        counter -= 1
    return counter

if __name__ == "__main__":
    num = 5
    arr = [2,4,6,8,10]
    HCF = findHCF(num, arr)
    print(HCF)
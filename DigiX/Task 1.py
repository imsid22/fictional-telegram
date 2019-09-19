def multiples():
    """
    This function loops through the numbers from 1 to 100
    and determines which ones are multiples of the numbers 3 and 5
    and prints those specific numbers
    :return: None
    """
    for i in range(1, 101):
        if i%3==0 or i%5==0:
            print(i)

if __name__ == "__main__":
    multiples()
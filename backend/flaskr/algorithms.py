import numpy as np
from numpy import loadtxt


def format_student_data(file_name):
    """converts a csv from synergy into the data used in the grouping algorithms

    Args:
        file_name (str): The name of the file to be opened with file extension

    Returns:
        students (array): Dictionaries of each student's information based on the csv file
    
    """
    file = open(file_name, 'rt')
    #last,first,...

    data = loadtxt(file,dtype=np.str_, delimiter=',')

    students = []
    for i in range(1,len(data)):
        students.append({id:i})
        
        for j in range(len(data[i])):
            students[data[0][j]] = data[i][j]

    return students

def student_sort(students,key="Last",reverse=False):
    """sorts students by either their first or last name
    
    Args:
        students (array): An array of dictionaries representing each student's data
        reverse (bool): A boolean representing if the sorted array should be reversed or not
        key (str): The data in their dictionary the students should be sorted on

    Return:
        sorted (array): The students array sorted with the given parameters
    """
    return students.sort(reverse=reverse,key=key)
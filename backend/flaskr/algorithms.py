import numpy as np
from numpy import loadtxt


def format_student_data(file_name):
    """converts a csv from synergy into the data used in the grouping algorithms

    Args:
    file_name (str): The name of the file to be opened with file extension

    Returns:
    data (array): List of eachs tudent with their corresponding information
    
    """
    file = open(file_name, 'rt')
    #last,first,...

    data = loadtxt(file,dtype=np.str_, delimiter=',',skiprows=1)

    return data

def alphabetical_sort(students,reverse=False,first_name = False):
    
    return students.sort(reverse=reverse,)
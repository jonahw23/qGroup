import numpy as np
import math
import random
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
        students.append({"id":i})
        
        for j in range(len(data[i])):
            students[data[0][j]] = data[i][j]

    return students

def helper_sort(key):
    return lambda a : a[key]

def student_sort(students,key="Last name",reverse=False):
    """sorts students by either their first or last name
    
    Args:
        students (array): An array of dictionaries representing each student's data
        reverse (bool): A boolean representing if the sorted array should be reversed or not
        key (str): The data in their dictionary the students should be sorted on

    Return:
        sorted (array): The students array sorted with the given parameters
    """
    students.sort(reverse=reverse,key=helper_sort(key))
    return students

def groups_of_fixed_size(students,n):
    leftover = len(students)%n
    total_groups = math.ceil(len(students)/n)
    num_small_groups = n - leftover
    groups = []
    for i in range(total_groups):
        groups.append([])
    group_num = 0
    for i in range(len(students)):
        if (total_groups - group_num > num_small_groups and len(groups[group_num]) < n) or (total_groups - group_num <= num_small_groups and len(groups[group_num]) < n-1):
            pass
        else:
            group_num += 1
        #groups[group_num].append(students[i])
        groups[group_num].append(students[i]["id"])
    return groups

def groups_of_fixed_amount(students,k):
    size = math.ceil(len(students)/k)
    return groups_of_fixed_size(students,size)


def group_students(students,group_amount=0,group_size=0,sort_by=False,reverse=False,weights=False):
    """sorts students into groupd with the corresponding parameters

    Args:
        students (array): An array of dictionaries representing each student's data
        group_amount (int): How many groups should the students be sorted inti
        group_size (int): How many students should be in each group (will be overriden if group_amount is set)
        sort_by (str): If students should be sorted, what key will be used
        reverse (bool): A boolean representing if the sorted array should be reversed or not
        weights (array): wieghts matrix for students (UNIMPLEMENTED)
    
    Returns:
        False if failed or the grouped students
    """
    if not sort_by == False:
        s = student_sort(students,key=sort_by,reverse=reverse)
        if group_size > 0:
            return groups_of_fixed_size(s,group_size)
        elif group_amount > 0:
            return groups_of_fixed_amount(s,group_amount)

    if group_size <= 0 and group_amount <= 0:
        return False


def generate_test_data(length,values):
    """creates data to test grouping algorithms

    Args:
        length (int): how many rows
        values (str array): what columns

    Returns:
        array of "students"    
    """
    students = []
    for i in range(length):
        students.append({"id": i})
        for j in range(len(values)):
            students[i][values[j]] = random.randint(0,100)
    return students
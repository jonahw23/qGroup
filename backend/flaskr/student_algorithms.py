import numpy as np
import math
import random
from numpy import loadtxt
import csv


def format_student_data(file_name):
    """converts a csv from synergy into the data used in the grouping algorithms

    Args:
        file_name (str): The name of the file to be opened with file extension

    Returns:
        students (array): Dictionaries of each student's information based on the csv file
    
    """
    file = open(file_name, 'rt')
    #last,first,...
    c = csv.reader(file,delimiter = ",",quotechar="\"")
    data = []
    index = 0
    for row in c:
        if index != 0:
            data.append(row)
        index += 1
    print(data)

    #data = loadtxt(file,dtype=np.str_, delimiter=',')

    print("done?")
    students = []
    for i in range(len(data)):
        students.append({"id":i})

        name = data[i][0].split(", ")
        fname = name[1].split(" ")

        students[i]["first_name"] = fname[0]
        students[i]["last_name"] = name[0]
        for j in range(1,len(data[i])):
            students[i][data[0][j]] = data[i][j]

    return students

def helper_sort(key,student_list):
    #return lambda a : a[key]
    return lambda a : student_list[a][key]

def student_sort(students,key="Last name",reverse=False):
    """sorts students by either their first or last name
    
    Args:
        students (array): An array of dictionaries representing each student's data
        reverse (bool): A boolean representing if the sorted array should be reversed or not
        key (str): The data in their dictionary the students should be sorted on

    Return:
        sorted (array): The students array sorted with the given parameters
    """
    s = [*range(len(students))]
    s.sort(reverse=reverse,key=helper_sort(key,students))
    #students.sort(reverse=reverse,key=helper_sort(key))
    return s

def random_student_order(students):
    index_list = [*range(len(students))]
    randomized = []
    for i in range(len(students)):
        rand_index = random.randint(0,len(index_list)-1)
        #randomized.append(students[index_list[rand_index]])
        randomized.append(index_list[rand_index])
        index_list.pop(rand_index)

    return randomized

def groups_of_fixed_size(students,n):
    leftover = len(students)%n
    total_groups = math.ceil(len(students)/n)
    num_small_groups = (n - leftover)%n
    groups = []
    for i in range(total_groups):
        groups.append([])
    group_num = 0
    for i in range(len(students)):
        if (total_groups - group_num > num_small_groups and len(groups[group_num]) < n) or (total_groups - group_num <= num_small_groups and len(groups[group_num]) < n-1):
            pass
        else:
            group_num += 1
        groups[group_num].append(students[i])
        #groups[group_num].append(students[i]["id"])
    return groups

def groups_of_custom_size(students,max_group_size):
    groups = []
    for i in range(len(max_group_size)):
        groups.append([])
    group_num = 0
    for i in range(len(students)):
        if len(groups[group_num]) < max_group_size[group_num]:
            pass
        else:
            group_num += 1
        groups[group_num].append(students[i])
        #groups[group_num].append(students[i]["id"])
    return groups


def groups_of_fixed_amount(students,k):
    size = math.ceil(len(students)/k)
    return groups_of_fixed_size(students,size)

def get_sizes_for_groups_of_fixed_size(students,max_group_size):
    """gets a size of group sizes bounded by a max group

    Args:
        students (array): An array of dictionaries representing each student's data
        max_group_size (int): largest size a group can be
    
    Returns:
        list of group sizes

    """

    group_sizes = []
    base_size = 1
    
    for i in range(max_group_size-1,1,-1):
        if len(students) % i <= math.floor(len(students)/i):
            base_size = i
            break;
    num_groups = math.floor(len(students)/base_size)
    num_groups = math.ceil((len(students)-0)/max_group_size)
    for i in range(num_groups):
        group_sizes.append(base_size)
    for i in range(len(students) - base_size * num_groups):
        group_sizes[i] += 1
    return group_sizes

def get_sizes_for_groups_of_fixed_amount(students,group_amount):
    """gets a size of group sizes bounded by a max group

    Args:
        students (array): An array of dictionaries representing each student's data
        group_amount (int): amount of groups to make
    
    Returns:
        list of group sizes

    """
    size = math.ceil(len(students)/group_amount)
    return get_sizes_for_groups_of_fixed_size(students,size)                


def group_students(students,group_amount=0,group_size=0,sort_by="random",reverse=False,weights=False,group_sizes=False):
    """sorts students into groupd with the corresponding parameters

    Args:
        students (array): An array of dictionaries representing each student's data
        group_amount (int): How many groups should the students be sorted in it
        group_size (int): How many students should be in each group (will be overriden if group_amount is set)
        sort_by (str): If students should be sorted, what key will be used
        reverse (bool): A boolean representing if the sorted array should be reversed or not
        weights (array): wieghts matrix for students
        group_sizes (int array): Optional parameter that gives custom group sizes instead of uniform groups
    
    Returns:
        False if failed or the grouped students
    """
    w = False
    if weights != False:
        w = {}
        for s1 in weights:
            w[str(s1)] = {}
            for s2 in weights[s1]:
                w[str(s1)][str(s2)] = weights[s1][s2]
    weights = w

    
    if sort_by == "random":
        if weights == False:
            s = random_student_order(students)
        else:
            return weighted_student_groups(students,weights,group_amount=group_amount,group_size=group_size,group_sizes = group_sizes)
    else:
        s = student_sort(students,key=sort_by,reverse=reverse)
    if group_sizes != False:
        return groups_of_custom_size(s,group_sizes)
    elif group_size > 0:
        return groups_of_custom_size(s,get_sizes_for_groups_of_fixed_size(s,group_size))
        #return groups_of_fixed_size(s,group_size)
    elif group_amount > 0:
        return groups_of_custom_size(s,get_sizes_for_groups_of_fixed_amount(s,group_amount))
        #return groups_of_fixed_amount(s,group_amount)

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

def generate_test_weights(length,scale=5):
    """creates weights to test grouping algorithms

    Args:
        length (int): how many rows
        scale (int): how many non-0 weights there should be in the test data

    Returns:
        matrix of weights    
    """
    randIds = []
    for i in range(length):
        randIds.append(str(i))
    weights = {}
    for i in range(length):
        weights[randIds[i]] = {}
        for j in range(length):
            weights[randIds[i]][randIds[j]] = 0
    for i in range(length * scale):
        a = randIds[random.randint(0,length-1)]
        b = randIds[random.randint(0,length-1)]
        w = random.randint(-1,1)
        if a != b:
            weights[a][b] = w
            weights[b][a] = w
    return weights

def most_connections(weights,val):
    """Ranks the indecies with the most values in a matrix

    Args:
        weights (matrix): input weights
        val: what to look for in the matrix

    Returns:
        indecies (int array): indecies of weight column sorted by the amount of times val appears
        count (int array): the amount of times val appears for each index

    """
    count = {}
    #for key in a_dict.keys():
    for i in weights:
        count[i] = 0
        for j in weights[i]:
             
            if weights[i][j] == val:
                count[i] += 1
    indecies = [*weights.keys()]
    indecies.sort(key=lambda w : count[w],reverse=True)
    return indecies, count

def place_student(student,groups,weights,student_group_map,max_group_size):
    """Places a student in a group with priorities for weight properties

    Args:
        student (int): student index to place
        groups (int matrix): existing groups
        weights (int matrix): weights between students
        student_group_map (dictionary): maps a student's index to the group it is in
        max_group_size (int array): max size for each group

    Returns:
        success (boolean): if the placement was successful
        groups (int matrix): updates groups
        student_group_map (dictionary): updated map from student indecies to the group they are in
    """
    avalible_groups = []
    positive_weighted_groups = []
    for i in range(len(groups)):
        avalible_groups.append(True)
        positive_weighted_groups.append(False)
    for i in student_group_map:
        #set avalability for groups with neg weights to false
        if weights[str(student)][str(i)] == -1:
            avalible_groups[student_group_map[i]] = False
        #set groups with positive weights to True
        elif weights[str(student)][str(i)] == 1:
            positive_weighted_groups[student_group_map[i]] = True
    priority_group_pool = []
    group_pool = []
    all_group_pool = []
    for i in range(len(groups)):
        #no bad students and at least 1 needed connection
        if positive_weighted_groups[i] and avalible_groups[i]:
            priority_group_pool.append(i)
        #no bad students
        if avalible_groups[i]:
            group_pool.append(i)
        #all
        all_group_pool.append(i)

    #These contain the indecies for the original list, NOT the group number
    rand_p_g_p = random_student_order(priority_group_pool)
    rand_g_p = random_student_order(group_pool)
    rand_a_g_p = random_student_order(all_group_pool)



    #go in order and check each group for size constraints
    for i in range(len(rand_p_g_p)):
        g = priority_group_pool[rand_p_g_p[i]]
        if len(groups[g]) < max_group_size[g]:
            groups[g].append(student)
            student_group_map[student]= g
            return True, groups,student_group_map
    for i in range(len(rand_g_p)):
        g = group_pool[rand_g_p[i]]
        if len(groups[g]) < max_group_size[g]:
            groups[g].append(student)
            student_group_map[student]= g
            return True, groups,student_group_map
    for i in range(len(rand_a_g_p)):
        g = all_group_pool[rand_a_g_p[i]]
        if len(groups[g]) < max_group_size[g]:
            groups[g].append(student)
            student_group_map[student]= g
            return True, groups,student_group_map
    return False, groups,student_group_map 

def weighted_student_groups(students,weights,group_amount=0,group_size=0,group_sizes = False):
    """Groups students based on given weights with 1 being should be in the same group and -1 being should not

    Args:
        students (dict array): array of students
        weights (int matrix): weights between students with -1 being not in the same group and 1 being in the same group
        group_amount (int): How many groups should the students be sorted inti
        group_size (int): How many students should be in each group (will be overriden if group_amount is set)

    Returns:
        groups (int matrix): weighted grouping of the students based on the specifications

    """
    if group_size > 0:
        pass
    elif group_amount > 0:
        group_size = math.ceil(len(students)/group_amount)
    n = group_size
    leftover = len(students)%n
    total_groups = math.ceil(len(students)/n)
    num_small_groups = (n - leftover)%n    
    groups = []
    max_group_size = []
    for i in range(total_groups):
        groups.append([])
        if total_groups - i <= num_small_groups:
            max_group_size.append(group_size-1)
        else:
            max_group_size.append(group_size)
            
    if group_sizes != False:
        max_group_size = group_sizes
        groups = []
        for i in range(len(max_group_size)):
            groups.append([])
        
    placed_students = {}
    for i in range(len(students)):
        #print(students[i])
        placed_students[students[i]['id']] = False
    student_group_map = {}

    most_neg, neg_amount = most_connections(weights,-1)


    #Place most negative people first in random groups

    for i in range(len(most_neg)):
        student = most_neg[i]
        if neg_amount[student] > 0 and placed_students[int(student)] == False:
            success, groups,student_group_map = place_student(student,groups,weights,student_group_map,max_group_size)
            placed_students[int(student)] = success

    most_pos, pos_amount = most_connections(weights,1)


    #Place most positive people in random groups

    for i in range(len(most_pos)):
        student = most_pos[i]
        if pos_amount[str(student)] > 0 and placed_students[int(student)] == False:
            success, groups,student_group_map = place_student(student,groups,weights,student_group_map,max_group_size)
            placed_students[int(student)] = success


    #place everyone else

    rand_student = random_student_order(students)

    for i in range(len(rand_student)):
        student = rand_student[i]
        if(int(student) in placed_students):
            if placed_students[int(student)] == False:
                success, groups,student_group_map = place_student(student,groups,weights,student_group_map,max_group_size)
                placed_students[int(student)] = success


    return groups
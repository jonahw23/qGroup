def cluster(points, num_groups):
    from sklearn.cluster import KMeans
    spec = KMeans(n_clusters=num_groups)
    spec.fit(points)
    return spec

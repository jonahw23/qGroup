def cluster(points, num_groups):
    from sklearn.cluster import SpectralClustering
    spec = SpectralClustering(n_clusters=num_groups)
    spec.fit(points)
    return spec

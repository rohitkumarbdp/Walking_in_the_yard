import numpy as np


class Game:
    def __init__(self, k):
        self.k = k
        self.vectors = self.generate_vectors()
        self.chosen_vectors = np.zeros(k, dtype=bool)

    def generate_vectors(self):
        theta = np.random.uniform(0, 2 * np.pi, self.k)
        r = np.sqrt(np.random.uniform(0.8, 0.99, self.k))
        xs = r * np.cos(theta)
        ys = r * np.sin(theta)
        xs[-1] = -sum(xs[:-1])
        ys[-1] = -sum(ys[:-1])

        if xs[-1] ** 2 + ys[-1] ** 2 < 1:
            return np.array([xs, ys]).T
        else:
            # print("Invalid vectors generated. Trying again...")
            return self.generate_vectors()

    @property
    def resultant_vector(self):
        out = np.zeros(2)
        for ind in range(self.k):
            if self.chosen_vectors[ind]:
                out += self.vectors[ind]

        return out
    
    def run_order(self, order=None, rand=False):
        self.chosen_vectors = np.zeros(self.k, dtype=bool)
        if rand:
            order = np.random.permutation(self.k)

        for ind in order:
            self.chosen_vectors[ind] = True
            if np.linalg.norm(self.resultant_vector) > 2:
                return False
        
        return True
    
    def smart_order(self):
        self.chosen_vectors = np.zeros(self.k, dtype=bool)

        while True:
            my_vector = None
            my_dot_value = np.inf
            for ind in range(self.k):
                if self.chosen_vectors[ind]:
                    continue
                if np.dot(self.vectors[ind], self.resultant_vector) < my_dot_value:
                    my_dot_value = self.vectors[ind].dot(self.resultant_vector)
                    my_vector = ind

            if my_vector is None:
                return True
            
            self.chosen_vectors[my_vector] = True
            if np.linalg.norm(self.resultant_vector) > 2:
                return False

count = 0
T_iter = 100
for _ in range(T_iter):
    g = Game(10)
    if g.smart_order():
        count += 1

print(count / T_iter * 100, "%")
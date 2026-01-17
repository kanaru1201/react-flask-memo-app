package infra

import (
	"database/sql"

	"react-flask-memo-app/backend-go/domain/model"
	"react-flask-memo-app/backend-go/domain/repository"
)

type userRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) repository.UserRepository {
	return &userRepository{db}
}

func (r *userRepository) Create(user *model.User) error {
	_, err := r.db.Exec("INSERT INTO users (username, password) VALUES ($1, $2)", user.Username, user.Password)
	return err
}

func (r *userRepository) FindByUsername(username string) (*model.User, error) {
	user := &model.User{}
	err := r.db.QueryRow("SELECT userid, username, password FROM users WHERE username = $1", username).Scan(&user.ID, &user.Username, &user.Password)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *userRepository) FindByID(id int) (*model.User, error) {
	var username string
	err := r.db.QueryRow("SELECT username FROM users WHERE userid = $1", id).Scan(&username)
	if err != nil {
		return nil, err
	}
	return &model.User{ID: id, Username: username}, nil
}

func (r *userRepository) Exists(username string) (bool, error) {
	var exists int
	err := r.db.QueryRow("SELECT 1 FROM users WHERE username = $1", username).Scan(&exists)
	if err == sql.ErrNoRows {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return true, nil
}

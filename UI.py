import sys
from PyQt5.QtWidgets import QApplication, QWidget, QPushButton, QLabel, QGridLayout
from PyQt5.QtGui import QPixmap, QPainter
from PyQt5.QtCore import Qt

class GomokuApp(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Gomoku Game")
        self.setGeometry(100, 100, 500, 500)

        self.board_size = 10
        self.init_ui()

    def init_ui(self):
        layout = QGridLayout()
        layout.setHorizontalSpacing(0)
        layout.setVerticalSpacing(0)

        self.buttons = [[None] * self.board_size for _ in range(self.board_size)]
        self.stone_colors = [[""] * self.board_size for _ in range(self.board_size)]

        self.current_stone = "black"

        for row in range(self.board_size):
            for col in range(self.board_size):
                button = QPushButton()
                button.setFixedSize(50, 50)
                button.setStyleSheet("QPushButton { background-color: #80471C; border: 1px solid #CD853F; }")
                button.clicked.connect(lambda _, r=row, c=col: self.move_stone(r, c))
                layout.addWidget(button, row, col)
                self.buttons[row][col] = button

        self.setLayout(layout)

    def move_stone(self, row, col):
        button = self.buttons[row][col]
        if not self.stone_colors[row][col]:
            stone_pixmap = QPixmap(50, 50)
            painter = QPainter(stone_pixmap)
            painter.setBrush(Qt.black if self.current_stone == "black" else Qt.white)
            painter.drawEllipse(0, 0, 50, 50)
            painter.end()

            button.setStyleSheet(f"QPushButton {{ background-image: url({stone_pixmap.toImage()}); }}"
                                 "QPushButton:pressed { background-image: url({stone_pixmap.toImage()}); }")

            self.stone_colors[row][col] = self.current_stone
            self.current_stone = "black" if self.current_stone == "white" else "white"

if __name__ == "__main__":
    app = QApplication(sys.argv)
    gomoku_app = GomokuApp()
    gomoku_app.show()
    sys.exit(app.exec_())
